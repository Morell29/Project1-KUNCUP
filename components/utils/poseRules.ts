import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// ─── MediaPipe Pose Landmark indices ────────────────────────────────────────
// MediaPipe memberi label berdasarkan perspektif SUBJEK (orang), bukan kamera.
// Pada kamera depan (selfie), gambar raw TIDAK di-mirror sebelum diproses
// MediaPipe. Jadi:
//   "left"  di MediaPipe = sisi KIRI subjek  (muncul di KANAN gambar raw)
//   "right" di MediaPipe = sisi KANAN subjek (muncul di KIRI  gambar raw)
//
//  7  = left ear   → telinga KIRI subjek
//  8  = right ear  → telinga KANAN subjek
// 11  = left shoulder  → bahu KIRI subjek
// 12  = right shoulder → bahu KANAN subjek
// 15  = left wrist  → pergelangan KIRI subjek
// 16  = right wrist → pergelangan KANAN subjek

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Deteksi "Pegang Telinga Kanan":
 * Pergelangan tangan kanan (16) harus mendekati telinga kanan (8).
 * Threshold dinormalisasi terhadap lebar bahu agar invariant terhadap jarak kamera.
 */
export function isHoldingRightEar(landmarks: NormalizedLandmark[]): boolean {
  if (landmarks.length < 17) return false;

  const rightEar    = landmarks[8];  // telinga kanan subjek
  const rightWrist  = landmarks[16]; // pergelangan kanan subjek
  const leftShoulder  = landmarks[11];
  const rightShoulder = landmarks[12];

  const shoulderWidth = dist(leftShoulder, rightShoulder);
  if (shoulderWidth < 0.01) return false; // deteksi badan tidak valid

  // Wrist dianggap "menyentuh" telinga jika jaraknya < 40% lebar bahu
  return dist(rightWrist, rightEar) < shoulderWidth * 0.40;
}

/**
 * Deteksi "Angkat Tangan Kiri":
 * Pergelangan tangan kiri (15) harus berada di ATAS bahu kiri (11).
 * Margin 8% tinggi frame untuk menghindari false positive saat tangan setara bahu.
 */
export function isLeftHandRaised(landmarks: NormalizedLandmark[]): boolean {
  if (landmarks.length < 17) return false;

  const leftWrist    = landmarks[15]; // pergelangan kiri subjek
  const leftShoulder = landmarks[11]; // bahu kiri subjek

  // Y bertambah ke bawah di MediaPipe. Wrist "lebih tinggi" = y lebih kecil.
  return leftWrist.y < leftShoulder.y - 0.08;
}
