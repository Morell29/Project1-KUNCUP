// ─── XP System — KUNCUP ──────────────────────────────────────────────────────
// Menggunakan localStorage agar data persisten antar halaman.
// Perubahan XP dipropagasi via CustomEvent "xp-update" sehingga XPBar
// bisa update tanpa perlu React Context di seluruh tree.

export type Level = {
  id: "tunas" | "kuncup" | "mekar";
  name: string;
  emoji: string;
  minXP: number;
  maxXP: number; // XP saat naik ke level berikutnya (Infinity untuk level terakhir)
  color: string;
  bg: string;
};

export const LEVELS: Level[] = [
  {
    id: "tunas",
    name: "Tunas Ceria",
    emoji: "🌱",
    minXP: 0,
    maxXP: 100,
    color: "#88B04B",
    bg: "#E8F5D6",
  },
  {
    id: "kuncup",
    name: "Kuncup Ceria",
    emoji: "🌸",
    minXP: 100,
    maxXP: 250,
    color: "#2A9D8F",
    bg: "#D6F0EC",
  },
  {
    id: "mekar",
    name: "Mekar Ceria",
    emoji: "🌻",
    minXP: 250,
    maxXP: Infinity,
    color: "#F4A261",
    bg: "#FEF0E7",
  },
];

export type XPActivity = {
  source: "assessment" | "flashcard" | "video_correct" | "video_wrong";
  amount: number;
  label: string;
  timestamp: number;
};

export type XPState = {
  total: number;
  history: XPActivity[];
  /** Aspek-aspek kesiapan berdasarkan sumber aktivitas */
  aspects: {
    motorik: number;    // dari assessment
    kognitif: number;   // dari flashcard
    bahasa: number;     // dari video
    sosial: number;     // dari video sosial (semua video dihitung)
  };
};

const STORAGE_KEY = "kuncup_xp";

const INITIAL_STATE: XPState = {
  total: 0,
  history: [],
  aspects: { motorik: 0, kognitif: 0, bahasa: 0, sosial: 0 },
};

// ── Baca state dari localStorage ─────────────────────────────────────────────
export function readXP(): XPState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as XPState) : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

// ── Simpan state ke localStorage ─────────────────────────────────────────────
function saveXP(state: XPState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Broadcast ke semua komponen yang subscribe
  window.dispatchEvent(new CustomEvent("xp-update", { detail: state }));
}

// ── Tambah XP ─────────────────────────────────────────────────────────────────
export function addXP(
  source: XPActivity["source"],
  amount: number,
  label: string
): XPState {
  const state = readXP();
  const activity: XPActivity = { source, amount, label, timestamp: Date.now() };

  const next: XPState = {
    total: state.total + amount,
    history: [...state.history, activity],
    aspects: { ...state.aspects },
  };

  // Akumulasi aspek
  if (source === "assessment") next.aspects.motorik += amount;
  if (source === "flashcard")  next.aspects.kognitif += amount;
  if (source === "video_correct" || source === "video_wrong") {
    next.aspects.bahasa  += Math.round(amount * 0.5);
    next.aspects.sosial  += Math.round(amount * 0.5);
  }

  saveXP(next);
  return next;
}

// ── Reset (untuk testing) ─────────────────────────────────────────────────────
export function resetXP(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("xp-update", { detail: INITIAL_STATE }));
}

// ── Helper: tentukan level dari total XP ──────────────────────────────────────
export function getLevel(totalXP: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

// ── Helper: berapa XP & % sampai level berikutnya ────────────────────────────
export function getLevelProgress(totalXP: number): {
  level: Level;
  nextLevel: Level | null;
  xpInLevel: number;   // XP yang sudah dikumpulkan dalam level ini
  xpNeeded: number;    // Total XP yang dibutuhkan untuk naik level
  pct: number;         // 0–100
} {
  const level = getLevel(totalXP);
  const idx   = LEVELS.findIndex((l) => l.id === level.id);
  const next  = LEVELS[idx + 1] ?? null;

  if (!next) {
    return { level, nextLevel: null, xpInLevel: totalXP - level.minXP, xpNeeded: 0, pct: 100 };
  }

  const xpInLevel = totalXP - level.minXP;
  const xpNeeded  = next.minXP - level.minXP;
  const pct       = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  return { level, nextLevel: next, xpInLevel, xpNeeded, pct };
}

// ── XP per aktivitas (konstanta publik) ───────────────────────────────────────
export const XP_REWARD = {
  assessment_task: 20,   // per task yang dikonfirmasi (max 80/sesi)
  flashcard_correct: 10, // jawaban benar flashcard
  flashcard_wrong: 3,    // jawaban salah flashcard (tetap diberi reward)
  video_correct: 25,     // jawaban evaluasi benar
  video_wrong: 8,        // jawaban evaluasi salah
} as const;
