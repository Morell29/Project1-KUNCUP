"use client";

import { useEffect, useRef, useState } from "react";

import {
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils";

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const [aiStatus, setAiStatus] = useState("Belum dimuat");
  const [cameraStatus, setCameraStatus] = useState("Menghubungkan kamera...");

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

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
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
  async function loadAI() {
    try {
      setAiStatus("🟡 Memuat MediaPipe...");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
      );

      setAiStatus("🟡 Memuat model AI...");

      poseLandmarkerRef.current =
        await PoseLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "/models/pose_landmarker_lite.task",
            },
            runningMode: "VIDEO",
            numPoses: 1,
          }
        );

      setAiStatus("🟢 AI siap digunakan");
    } catch (err) {
      console.error(err);
      setAiStatus("🔴 Gagal memuat AI");
    }
  }

  loadAI();
}, []);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-extrabold">
        Kamera AI Assessment
      </h2>

      <div className="mt-2 space-y-1 text-sm">
        <p>{cameraStatus}</p>
        <p>{aiStatus}</p>
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
            className="absolute inset-0 h-full w-full pointer-events-none"
        />
      </div>
    </div>
  );
}