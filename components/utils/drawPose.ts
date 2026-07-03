import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export function drawPose(
  canvas: HTMLCanvasElement,
  landmarks: NormalizedLandmark[]
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#4D96FF";

  landmarks.forEach((point) => {
    ctx.beginPath();

    ctx.arc(
      point.x * canvas.width,
      point.y * canvas.height,
      5,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });
}