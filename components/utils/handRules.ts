import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Index landmark tangan (standar MediaPipe HandLandmarker, 21 titik):
// 0 = pergelangan tangan (wrist)
// Jempol: 1,2,3,4 (4 = ujung)
// Telunjuk: 5,6,7,8 (8 = ujung)
// Tengah: 9,10,11,12 (12 = ujung)
// Manis: 13,14,15,16 (16 = ujung)
// Kelingking: 17,18,19,20 (20 = ujung)

/**
 * Cek apakah jari (selain jempol) terangkat.
 * Menggunakan koordinat Y: di MediaPipe, Y bertambah ke BAWAH.
 * Jadi jari terangkat = tip.y < pip.y (ujung jari lebih tinggi dari sendi PIP).
 */
function isFingerExtended(
  landmarks: NormalizedLandmark[],
  tipIndex: number,
  pipIndex: number
): boolean {
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];
  return tip.y < pip.y;
}

/**
 * Cek apakah jempol terangkat, berdasarkan ARAH VEKTOR jempol.
 *
 * Masalah dengan pendekatan berbasis jarak:
 *   - Ujung jempol (tip) secara anatomis selalu lebih jauh dari semua titik
 *     referensi (wrist, indexMcp, dll) bahkan saat ditekuk, karena jempol
 *     punya panjang sendiri yang menjulur dari sisi telapak.
 *
 * Solusi: cek ARAH vektor dari thumbMcp (2) → thumbTip (4).
 *   - Jempol terangkat → vektor mengarah ke ATAS (dy negatif karena Y bertambah ke bawah)
 *     DAN cukup vertikal (komponen atas ≥ 80% dari komponen samping)
 *   - Jempol ditekuk ke samping → vektor hampir horizontal (|dx| dominan, |dy| kecil)
 *   - Jempol ditekuk ke bawah → dy positif → langsung gugur
 *
 * Tidak memerlukan data handedness (berlaku untuk tangan kiri & kanan).
 * Tidak sensitif terhadap posisi tangan di frame.
 *
 * Contoh:
 *   Gesture "1" (telunjuk naik, jempol ke samping) → dy kecil, |dx| besar → TIDAK terhitung ✓
 *   Gesture "5" (semua naik, jempol diagonal ~45°+) → |dy| cukup besar → TERHITUNG ✓
 *   Thumbs up → dy sangat negatif → TERHITUNG ✓
 */
function isThumbExtended(landmarks: NormalizedLandmark[]): boolean {
  const thumbMcp = landmarks[2]; // pangkal jempol
  const thumbTip = landmarks[4]; // ujung jempol

  // Vektor dari pangkal jempol (MCP) ke ujung jempol (Tip)
  // dy negatif = mengarah ke atas layar (karena Y bertambah ke bawah di MediaPipe)
  const dy = thumbTip.y - thumbMcp.y;
  const dx = thumbTip.x - thumbMcp.x;

  // Jempol dianggap terangkat jika:
  // 1. Ujung jempol berada DI ATAS pangkal jempol (dy < 0)
  // 2. Komponen vertikal (ke atas) minimal 80% dari komponen horizontal (ke samping)
  //    → sudut minimal ~39° dari horizontal, menghindari deteksi palsu saat jempol miring ke samping
  return dy < 0 && (-dy) > Math.abs(dx) * 0.8;
}

/**
 * Menghitung jumlah jari yang terbuka (extended) pada satu tangan.
 *
 * @param landmarks - array 21 titik dari HandLandmarkerResult.landmarks[i]
 */
export function countExtendedFingers(
  landmarks: NormalizedLandmark[]
): number {
  if (!landmarks || landmarks.length < 21) return 0;

  let count = 0;

  if (isThumbExtended(landmarks))          count += 1; // jempol
  if (isFingerExtended(landmarks, 8,  6))  count += 1; // telunjuk
  if (isFingerExtended(landmarks, 12, 10)) count += 1; // tengah
  if (isFingerExtended(landmarks, 16, 14)) count += 1; // manis
  if (isFingerExtended(landmarks, 20, 18)) count += 1; // kelingking

  return count;
}