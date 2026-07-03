"use client";

import { useEffect, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

export default function MediaPipeCamera() {
  const [status, setStatus] = useState("Memuat MediaPipe...");

  useEffect(() => {
    async function loadModel() {
      try {
        setStatus("Memuat Vision Tasks...");

        const vision = await FilesetResolver.forVisionTasks(
          "/wasm"
        );

        setStatus("Memuat model AI...");

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

        setStatus("🟢 AI siap digunakan");
      } catch (err) {
        console.error(err);
        setStatus("🔴 Gagal memuat MediaPipe");
      }
    }

    loadModel();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <h2 className="font-bold text-lg">
        MediaPipe Status
      </h2>

      <p className="mt-3">{status}</p>
    </div>
  );
}