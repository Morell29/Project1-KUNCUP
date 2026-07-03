import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Index landmark tangan (standar MediaPipe HandLandmarker, 21 titik):
// 0 = pergelangan tangan (wrist)
// Jempol: 1,2,3,4 (4 = ujung)
// Telunjuk: 5,6,7,8 (8 = ujung)
// Tengah: 9,10,11,12 (12 = ujung)
// Manis: 13,14,15,16 (16 = ujung)
// Kelingking: 17,18,19,20 (20 = ujung)

function distance(a: NormalizedLandmark, b: NormalizedLandmark) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isFingerExtended(
  landmarks: NormalizedLandmark[],
  tipIndex: number,
  pipIndex: number
) {
  const wrist = landmarks[0];
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];

  // Jari terbuka jika ujung jari lebih jauh dari pergelangan
  // dibanding sendi tengahnya
  return distance(tip, wrist) > distance(pip, wrist);
}

function isThumbExtended(landmarks: NormalizedLandmark[]) {
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbMcp = landmarks[2];

  // Jempol dicek pakai jarak juga, tapi threshold sedikit
  // lebih longgar karena gerak jempol lebih ke samping
  return distance(thumbTip, wrist) > distance(thumbMcp, wrist) * 1.1;
}

/**
 * Menghitung jumlah jari yang terbuka (extended) pada satu tangan.
 * landmarks: array 21 titik dari HandLandmarkerResult.landmarks[i]
 */
export function countExtendedFingers(landmarks: NormalizedLandmark[]): number {
  if (!landmarks || landmarks.length < 21) return 0;

  let count = 0;

  if (isThumbExtended(landmarks)) count += 1;
  if (isFingerExtended(landmarks, 8, 6)) count += 1; // telunjuk
  if (isFingerExtended(landmarks, 12, 10)) count += 1; // tengah
  if (isFingerExtended(landmarks, 16, 14)) count += 1; // manis
  if (isFingerExtended(landmarks, 20, 18)) count += 1; // kelingking

  return count;
}