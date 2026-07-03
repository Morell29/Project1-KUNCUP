"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  HandLandmarker,
  type PoseLandmarkerResult,
  type HandLandmarkerResult,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { countExtendedFingers } from "@/components/utils/handRules";

function drawLandmarkPoints(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  color: string,
  radius = 4
) {
  ctx.fillStyle = color;

  for (const point of landmarks) {
    ctx.beginPath();
    ctx.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawConnectedLines(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: readonly { start: number; end: number }[],
  width: number,
  height: number,
  color: string,
  lineWidth = 3
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  for (const connection of connections) {
    const start = landmarks[connection.start];
    const end = landmarks[connection.end];

    if (!start || !end) continue;

    ctx.beginPath();
    ctx.moveTo(start.x * width, start.y * height);
    ctx.lineTo(end.x * width, end.y * height);
    ctx.stroke();
  }
}

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  const rafIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const streamRef = useRef<MediaStream | null>(null);

  const [aiStatus, setAiStatus] = useState("Belum dimuat");
  const [cameraStatus, setCameraStatus] = useState("Menghubungkan kamera...");
  const [fingerCount, setFingerCount] = useState(0);

  // 1) Aktifkan kamera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraStatus("🟢 Kamera aktif");
      } catch (err) {
        console.error(err);
        setCameraStatus("🔴 Kamera tidak dapat diakses");
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 2) Muat model Pose + Hand
  useEffect(() => {
    let cancelled = false;

    async function loadAI() {
      try {
        setAiStatus("🟡 Memuat MediaPipe...");

        const vision = await FilesetResolver.forVisionTasks("/wasm");

        setAiStatus("🟡 Memuat model pose...");

        const pose = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });

        setAiStatus("🟡 Memuat model tangan...");

        const hand = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        if (cancelled) {
          pose.close();
          hand.close();
          return;
        }

        poseLandmarkerRef.current = pose;
        handLandmarkerRef.current = hand;
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
      poseLandmarkerRef.current = null;
      handLandmarkerRef.current = null;
    };
  }, []);

  // 3) Loop deteksi + gambar skeleton pose & tangan
  useEffect(() => {
    function renderLoop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const poseLandmarker = poseLandmarkerRef.current;
      const handLandmarker = handLandmarkerRef.current;

      if (
        video &&
        canvas &&
        poseLandmarker &&
        handLandmarker &&
        video.readyState >= 2
      ) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;

          const now = performance.now();

          const poseResult: PoseLandmarkerResult =
            poseLandmarker.detectForVideo(video, now);

          const handResult: HandLandmarkerResult =
            handLandmarker.detectForVideo(video, now);

          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // mirror biar sejajar dengan video (video di-mirror via CSS)
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // gambar skeleton pose (badan)
            for (const landmarks of poseResult.landmarks) {
              drawConnectedLines(
                ctx,
                landmarks,
                PoseLandmarker.POSE_CONNECTIONS,
                canvas.width,
                canvas.height,
                "#2A9D8F",
                4
              );
              drawLandmarkPoints(
                ctx,
                landmarks,
                canvas.width,
                canvas.height,
                "#FF6F61",
                4
              );
            }

            // gambar skeleton tangan (jari)
            for (const landmarks of handResult.landmarks) {
              drawConnectedLines(
                ctx,
                landmarks,
                HandLandmarker.HAND_CONNECTIONS,
                canvas.width,
                canvas.height,
                "#F4A261",
                2
              );
              drawLandmarkPoints(
                ctx,
                landmarks,
                canvas.width,
                canvas.height,
                "#92A8D1",
                3
              );
            }

            ctx.restore();
          }

          // hitung jari dari tangan pertama yang terdeteksi (kalau ada)
          if (handResult.landmarks.length > 0) {
            const total = handResult.landmarks.reduce(
              (sum, hand) => sum + countExtendedFingers(hand),
              0
            );
            setFingerCount(total);
          } else {
            setFingerCount(0);
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    }

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-extrabold">Kamera AI Assessment</h2>

      <div className="mt-2 space-y-1 text-sm">
        <p>{cameraStatus}</p>
        <p>{aiStatus}</p>
        
          <p className="font-bold text-[var(--forest-teal)]">
            ✋ Jari terdeteksi: {fingerCount}
          </p>
       
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-video w-full object-cover scale-x-[-1]"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}