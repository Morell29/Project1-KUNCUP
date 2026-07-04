"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  HandLandmarker,
  FaceLandmarker,
  type PoseLandmarkerResult,
  type HandLandmarkerResult,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { countExtendedFingers } from "@/components/utils/handRules";
import { isHoldingRightEar, isLeftHandRaised } from "@/components/utils/poseRules";
import { areEyesClosed } from "@/components/utils/faceRules";

// ─── Types ───────────────────────────────────────────────────────────────────
export type AssessmentTaskId =
  | "holdRightEar"
  | "raiseLeftHand"
  | "closeEyes"
  | "countFingers";

interface CameraPreviewProps {
  /** Task yang sedang aktif untuk dideteksi. undefined = tidak ada deteksi. */
  activeTaskId?: AssessmentTaskId;
  /** Target jumlah jari (hanya untuk "countFingers"). */
  fingerTarget?: number;
  /** Aktifkan loop deteksi. */
  isDetecting?: boolean;
  /** Dipanggil saat kondisi task terkonfirmasi (ditahan 1,5 detik). */
  onDetected?: () => void;
}

// ─── Konstanta ───────────────────────────────────────────────────────────────
const CONFIRM_MS         = 1500; // durasi tahan untuk konfirmasi default (ms)
const CONFIRM_MS_FINGERS =  800; // durasi lebih singkat khusus hitung jari (ms)

// ─── Canvas drawing helpers ──────────────────────────────────────────────────
function drawLandmarkPoints(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  w: number, h: number,
  color: string, radius = 4
) {
  ctx.fillStyle = color;
  for (const p of landmarks) {
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawConnectedLines(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: readonly { start: number; end: number }[],
  w: number, h: number,
  color: string, lineWidth = 3
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  for (const { start, end } of connections) {
    const s = landmarks[start];
    const e = landmarks[end];
    if (!s || !e) continue;
    ctx.beginPath();
    ctx.moveTo(s.x * w, s.y * h);
    ctx.lineTo(e.x * w, e.y * h);
    ctx.stroke();
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CameraPreview({
  activeTaskId,
  fingerTarget = 1,
  isDetecting = false,
  onDetected,
}: CameraPreviewProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const rafIdRef       = useRef<number | null>(null);
  const lastTimeRef    = useRef(-1);
  const streamRef      = useRef<MediaStream | null>(null);

  // Refs agar render loop tidak pakai stale closure
  const isDetectingRef   = useRef(isDetecting);
  const activeTaskIdRef  = useRef(activeTaskId);
  const fingerTargetRef  = useRef(fingerTarget);
  const onDetectedRef    = useRef(onDetected);

  // State deteksi internal (refs untuk kecepatan, bukan re-render)
  const detectionStartRef    = useRef<number | null>(null);
  const confirmedRef         = useRef(false);
  const confirmProgressRef   = useRef(0);
  const justSuccessRef       = useRef(false);
  const successTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // UI state
  const [aiStatus, setAiStatus]       = useState("Belum dimuat");
  const [cameraStatus, setCameraStatus] = useState("Menghubungkan kamera...");
  const [fingerCount, setFingerCount]  = useState(0);

  // ── Suppress TFLite INFO logs ───────────────────────────────────────────
  // MediaPipe WASM runtime menulis pesan INFO ke console.error (bukan error nyata).
  // Kita filter agar tidak memenuhi console developer.
  useEffect(() => {
    const orig = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (msg.startsWith("INFO:")) return; // TFLite informational — abaikan
      orig(...args);
    };
    return () => { console.error = orig; };
  }, []);

  // ── Sync refs dengan props ──────────────────────────────────────────────
  useEffect(() => { isDetectingRef.current  = isDetecting;  }, [isDetecting]);
  useEffect(() => { activeTaskIdRef.current = activeTaskId; }, [activeTaskId]);
  useEffect(() => { fingerTargetRef.current = fingerTarget; }, [fingerTarget]);
  useEffect(() => { onDetectedRef.current   = onDetected;   }, [onDetected]);

  // Reset state deteksi setiap kali task atau target berubah
  useEffect(() => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    detectionStartRef.current  = null;
    confirmedRef.current       = false;
    confirmProgressRef.current = 0;
    justSuccessRef.current     = false;
  }, [activeTaskId, fingerTarget]);

  // ── Kamera ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraStatus("🟢 Kamera aktif");
      } catch (err) {
        console.error(err);
        setCameraStatus("🔴 Kamera tidak dapat diakses");
      }
    }
    startCamera();
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  // ── Muat model AI ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadAI() {
      try {
        setAiStatus("🟡 Memuat MediaPipe...");
        const vision = await FilesetResolver.forVisionTasks("/wasm");

        setAiStatus("🟡 Memuat model pose...");
        const pose = await PoseLandmarker.createFromOptions(vision, {
          // CPU (XNNPACK) lebih stabil di browser; GPU delegate sering fallback
          // dan menghasilkan INFO log yang tidak perlu.
          baseOptions: { modelAssetPath: "/models/pose_landmarker_lite.task", delegate: "CPU" },
          runningMode: "VIDEO", numPoses: 1,
        });

        setAiStatus("🟡 Memuat model tangan...");
        const hand = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/models/hand_landmarker.task", delegate: "CPU" },
          runningMode: "VIDEO", numHands: 2,
        });

        setAiStatus("🟡 Memuat model wajah...");
        const face = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/models/face_landmarker.task", delegate: "CPU" },
          runningMode: "VIDEO", numFaces: 1,
        });

        if (cancelled) { pose.close(); hand.close(); face.close(); return; }

        poseLandmarkerRef.current = pose;
        handLandmarkerRef.current = hand;
        faceLandmarkerRef.current = face;
        setAiStatus("🟢 AI siap digunakan");
      } catch (err) {
        console.error(err);
        setAiStatus("🔴 Gagal memuat AI");
      }
    }
    loadAI();
    return () => {
      cancelled = true;
      poseLandmarkerRef.current?.close();
      handLandmarkerRef.current?.close();
      faceLandmarkerRef.current?.close();
      poseLandmarkerRef.current = null;
      handLandmarkerRef.current = null;
      faceLandmarkerRef.current = null;
    };
  }, []);

  // ── Loop deteksi + render ───────────────────────────────────────────────
  useEffect(() => {
    function renderLoop() {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      const pose   = poseLandmarkerRef.current;
      const hand   = handLandmarkerRef.current;

      if (video && canvas && pose && hand && video.readyState >= 2) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width  = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        if (video.currentTime !== lastTimeRef.current) {
          lastTimeRef.current = video.currentTime;
          const now = performance.now();

          // ── Jalankan semua model ──────────────────────────────────────
          const poseResult: PoseLandmarkerResult = pose.detectForVideo(video, now);
          const handResult: HandLandmarkerResult = hand.detectForVideo(video, now);
          const faceResult = faceLandmarkerRef.current
            ? faceLandmarkerRef.current.detectForVideo(video, now)
            : null;

          // ── Hitung jari ───────────────────────────────────────────────
          const totalFingers = handResult.landmarks.reduce(
            (sum, h) => sum + countExtendedFingers(h), 0
          );
          setFingerCount(totalFingers);

          // ── Task detection + konfirmasi ────────────────────────────────
          const task       = activeTaskIdRef.current;
          const detecting  = isDetectingRef.current;

          if (detecting && task && !confirmedRef.current) {
            let detected = false;

            switch (task) {
              case "holdRightEar":
                if (poseResult.landmarks.length > 0)
                  detected = isHoldingRightEar(poseResult.landmarks[0]);
                break;
              case "raiseLeftHand":
                if (poseResult.landmarks.length > 0)
                  detected = isLeftHandRaised(poseResult.landmarks[0]);
                break;
              case "closeEyes":
                if (faceResult && faceResult.faceLandmarks.length > 0)
                  detected = areEyesClosed(faceResult.faceLandmarks[0]);
                break;
              case "countFingers":
                detected = totalFingers === fingerTargetRef.current;
                break;
            }

            if (detected) {
              if (!detectionStartRef.current) detectionStartRef.current = now;
              // Hitung jari pakai durasi lebih singkat agar tidak terlalu melelahkan
              const confirmDuration = task === "countFingers" ? CONFIRM_MS_FINGERS : CONFIRM_MS;
              const progress = Math.min(1, (now - detectionStartRef.current) / confirmDuration);
              confirmProgressRef.current = progress;

              if (progress >= 1) {
                confirmedRef.current     = true;
                justSuccessRef.current   = true;
                confirmProgressRef.current = 1;
                successTimerRef.current = setTimeout(() => {
                  justSuccessRef.current = false;
                  onDetectedRef.current?.();
                }, 600);
              }
            } else {
              detectionStartRef.current  = null;
              confirmProgressRef.current = 0;
            }
          }

          // ── Gambar canvas ──────────────────────────────────────────────
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;

            // === Bagian mirror (skeleton pose + tangan) ===
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);

            for (const lm of poseResult.landmarks) {
              drawConnectedLines(ctx, lm, PoseLandmarker.POSE_CONNECTIONS, w, h, "#2A9D8F", 4);
              drawLandmarkPoints(ctx, lm, w, h, "#FF6F61", 4);
            }
            for (const lm of handResult.landmarks) {
              drawConnectedLines(ctx, lm, HandLandmarker.HAND_CONNECTIONS, w, h, "#F4A261", 2);
              drawLandmarkPoints(ctx, lm, w, h, "#92A8D1", 3);
            }

            ctx.restore();
            // === Akhir bagian mirror ===

            // === Overlay UI (tidak mirror) ===
            if (detecting && task) {
              // Label target untuk countFingers
              if (task === "countFingers") {
                const label = `Tunjukkan ${fingerTargetRef.current} jari`;
                const pad   = 14;
                ctx.font = "bold 20px system-ui, sans-serif";
                const tw = ctx.measureText(label).width;
                ctx.fillStyle = "rgba(0,0,0,0.65)";
                ctx.beginPath();
                ctx.roundRect(w / 2 - tw / 2 - pad, 10, tw + pad * 2, 42, 21);
                ctx.fill();
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, w / 2, 31);
              }

              // Progress ring — tengah canvas agar selalu terlihat penuh
              const progress = confirmProgressRef.current;
              if (progress > 0 && !justSuccessRef.current) {
                const cx = w / 2;
                const cy = h / 2;  // tengah vertikal
                const r  = 36;     // sedikit lebih besar agar mudah dilihat
                ctx.lineCap   = "round";
                ctx.lineWidth = 8;
                // Lingkaran backdrop semi-transparan
                ctx.fillStyle = "rgba(0,0,0,0.35)";
                ctx.beginPath();
                ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
                ctx.fill();
                // Background ring
                ctx.strokeStyle = "rgba(255,255,255,0.20)";
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
                // Progress arc (hijau)
                ctx.strokeStyle = "#4CAF50";
                ctx.beginPath();
                ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
                ctx.stroke();
                // Persen di tengah ring
                ctx.fillStyle = "white";
                ctx.font = "bold 14px system-ui, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy);
              }

              // Flash sukses
              if (justSuccessRef.current) {
                ctx.fillStyle = "rgba(76,175,80,0.45)";
                ctx.fillRect(0, 0, w, h);
                ctx.font = "72px system-ui, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("✅", w / 2, h / 2);
              }
            }
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    }

    rafIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-extrabold">Kamera AI Assessment</h2>

      <div className="mt-2 space-y-1 text-sm">
        <p>{cameraStatus}</p>
        <p>{aiStatus}</p>
        {activeTaskId === "countFingers" && isDetecting && (
          <p className="font-bold text-[var(--forest-teal)]">
            ✋ Jari terdeteksi: {fingerCount} / target: {fingerTarget}
          </p>
        )}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-black">
        {/* Video (di-mirror via CSS) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-video w-full object-cover scale-x-[-1]"
        />
        {/* Canvas overlay (skeleton + UI) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}