import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// ─── FaceLandmarker — 468 titik wajah ────────────────────────────────────────
// Indeks kritis untuk deteksi mata terbuka/tertutup (Eye Aspect Ratio):
//
// Mata KIRI (perspektif gambar = mata KANAN subjek pada kamera depan):
//   Upper lid center : 159
//   Lower lid center : 145
//   Inner corner     :  33
//   Outer corner     : 133
//
// Mata KANAN (perspektif gambar = mata KIRI subjek):
//   Upper lid center : 386
//   Lower lid center : 374
//   Inner corner     : 362
//   Outer corner     : 263

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Eye Aspect Ratio (EAR) sederhana:
 *   EAR = jarak_vertikal / jarak_horizontal
 *
 * Saat mata terbuka : EAR ≈ 0.25 – 0.40
 * Saat mata tertutup: EAR ≈ 0.02 – 0.08
 */
function eyeAspectRatio(
  landmarks: NormalizedLandmark[],
  upper: number,
  lower: number,
  inner: number,
  outer: number
): number {
  const vertical   = dist(landmarks[upper], landmarks[lower]);
  const horizontal = dist(landmarks[inner], landmarks[outer]);
  if (horizontal < 0.001) return 1; // hindari div-by-zero
  return vertical / horizontal;
}

// EAR threshold: di bawah nilai ini mata dianggap tertutup
const EAR_CLOSED = 0.18;

/**
 * Kembalikan true jika KEDUA mata subjek tertutup.
 * Memerlukan hasil FaceLandmarker (>= 387 landmark).
 */
export function areEyesClosed(landmarks: NormalizedLandmark[]): boolean {
  if (landmarks.length < 387) return false;

  const leftEAR  = eyeAspectRatio(landmarks, 159, 145,  33, 133);
  const rightEAR = eyeAspectRatio(landmarks, 386, 374, 362, 263);

  return leftEAR < EAR_CLOSED && rightEAR < EAR_CLOSED;
}
