"use client";

import { useEffect, useRef, useState } from "react";
import { readXP, getLevelProgress, resetXP, type XPState } from "@/lib/xp";

// ─── XP Toast — muncul saat XP ditambah ──────────────────────────────────────
type Toast = { id: number; amount: number; label: string };

export default function XPBar() {
  const [state, setState]   = useState<XPState | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const prevTotal = useRef(0);
  const toastId   = useRef(0);

  // Baca state awal dari localStorage setelah mount
  useEffect(() => {
    const s = readXP();
    setState(s);
    prevTotal.current = s.total;
  }, []);

  // Subscribe ke custom event "xp-update"
  useEffect(() => {
    function onUpdate(e: Event) {
      const detail = (e as CustomEvent<XPState>).detail;
      setState(detail);

      const gained = detail.total - prevTotal.current;
      if (gained > 0) {
        // Cari label dari entri terakhir di history
        const last = detail.history[detail.history.length - 1];
        const id   = ++toastId.current;
        setToasts((prev) => [...prev, { id, amount: gained, label: last?.label ?? "" }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
      }
      prevTotal.current = detail.total;
    }

    window.addEventListener("xp-update", onUpdate);
    return () => window.removeEventListener("xp-update", onUpdate);
  }, []);

  if (!state) return null;

  const { level, nextLevel, xpInLevel, xpNeeded, pct } = getLevelProgress(state.total);

  return (
    <>
      {/* ── Toast XP pop-up ── */}
      <div className="fixed left-1/2 top-4 z-[200] -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-bounce-in flex items-center gap-2 rounded-full bg-[var(--forest-navy)] px-4 py-2 text-sm font-bold text-white shadow-xl"
            style={{ animation: "xpToast 2.5s ease forwards" }}
          >
            <span className="text-[var(--forest-yellow)]">+{t.amount} XP</span>
            {t.label && <span className="opacity-75">· {t.label}</span>}
          </div>
        ))}
      </div>

      {/* ── XP Bar Widget — pojok kanan bawah ── */}
      <div
        className="fixed bottom-5 right-5 z-[100] select-none"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {/* Panel utama */}
        <div
          className="overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(38,70,83,0.22)] ring-1 ring-white/40 backdrop-blur-md transition-all duration-300"
          style={{ backgroundColor: `${level.bg}f0`, minWidth: collapsed ? 0 : 220 }}
        >
          {!collapsed && (
            <div className="px-4 pt-3.5 pb-3">
              {/* Header: level + total XP */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{level.emoji}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: level.color }}>
                      Level
                    </p>
                    <p className="text-sm font-extrabold text-[var(--forest-navy)] leading-tight">
                      {level.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[var(--forest-navy)]/60">Total XP</p>
                  <p className="text-lg font-extrabold leading-tight" style={{ color: level.color }}>
                    {state.total}
                  </p>
                </div>
              </div>

              {/* Progress bar ke level berikutnya */}
              {nextLevel ? (
                <>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: level.color }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-[var(--forest-navy)]/55">
                    <span>{xpInLevel} / {xpNeeded} XP</span>
                    <span>{nextLevel.emoji} {nextLevel.name}</span>
                  </div>
                </>
              ) : (
                <div className="mt-2 rounded-xl bg-black/8 px-2 py-1 text-center text-[10px] font-bold" style={{ color: level.color }}>
                  🏆 Level Maksimum!
                </div>
              )}

              {/* Aspek mini */}
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {(
                  [
                    { key: "motorik",  label: "Motorik",  emoji: "💪" },
                    { key: "kognitif", label: "Kognitif", emoji: "🧠" },
                    { key: "bahasa",   label: "Bahasa",   emoji: "💬" },
                    { key: "sosial",   label: "Sosial",   emoji: "🤝" },
                  ] as const
                ).map(({ key, label, emoji }) => (
                  <div key={key} className="rounded-lg bg-white/50 px-2 py-1">
                    <p className="text-[9px] font-bold text-[var(--forest-navy)]/55">{emoji} {label}</p>
                    <p className="text-xs font-extrabold" style={{ color: level.color }}>
                      {state.aspects[key]} XP
                    </p>
                  </div>
                ))}
              </div>

              {/* Tombol reset (dev helper) */}
              <button
                onClick={resetXP}
                className="mt-2 w-full rounded-lg bg-black/5 py-1 text-[10px] font-semibold text-[var(--forest-navy)]/40 transition hover:bg-black/10"
              >
                Reset XP
              </button>
            </div>
          )}

          {/* Toggle button selalu muncul */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-black/8 py-2 text-[10px] font-bold transition hover:bg-black/5"
            style={{ color: level.color }}
          >
            <span className="text-base leading-none">{level.emoji}</span>
            {collapsed
              ? <span>{state.total} XP · {level.name}</span>
              : <span>Sembunyikan</span>}
          </button>
        </div>
      </div>

      {/* Keyframe toast animation */}
      <style>{`
        @keyframes xpToast {
          0%   { opacity: 0; transform: translateY(-8px) scale(0.9); }
          15%  { opacity: 1; transform: translateY(0)    scale(1);   }
          75%  { opacity: 1; transform: translateY(0)    scale(1);   }
          100% { opacity: 0; transform: translateY(-6px) scale(0.95);}
        }
      `}</style>
    </>
  );
}
