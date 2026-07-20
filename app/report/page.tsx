"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageDecorSimple from "@/components/PageDecorSimple";
import {
  readXP,
  getLevelProgress,
  LEVELS,
  type XPState,
} from "@/lib/xp";

// ─── Aspek report dengan fallback ke 0 ───────────────────────────────────────
const ASPECT_META = [
  { key: "motorik"  as const, label: "Motorik",   icon: "💪", color: "#92A8D1", desc: "Kemampuan mengikuti gerakan tubuh dari AI Assessment." },
  { key: "kognitif" as const, label: "Kognitif",  icon: "🧠", color: "#88B04B", desc: "Kemampuan berpikir dan mengenal konsep dari Flashcard." },
  { key: "bahasa"   as const, label: "Bahasa",    icon: "💬", color: "#F7CAC9", desc: "Kemampuan memahami isi video dan menjawab evaluasi." },
  { key: "sosial"   as const, label: "Sosial",    icon: "🤝", color: "#E9C46A", desc: "Kemampuan berinteraksi berdasarkan konten video." },
];

// Konversi XP aspek ke persentase (max: 300 XP → 100%)
function xpToPercent(xp: number, max = 300): number {
  return Math.min(100, Math.round((xp / max) * 100));
}

// ─── Komponen ─────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const [xp, setXP] = useState<XPState | null>(null);

  useEffect(() => {
    setXP(readXP());
    function onUpdate(e: Event) {
      setXP((e as CustomEvent<XPState>).detail);
    }
    window.addEventListener("xp-update", onUpdate);
    return () => window.removeEventListener("xp-update", onUpdate);
  }, []);

  const totalXP  = xp?.total ?? 0;
  const aspects  = xp?.aspects ?? { motorik: 0, kognitif: 0, bahasa: 0, sosial: 0 };
  const history  = xp?.history ?? [];
  const { level, nextLevel, xpInLevel, xpNeeded, pct } = getLevelProgress(totalXP);

  // Rata-rata persentase semua aspek = skor kesiapan keseluruhan
  const avgPct = ASPECT_META.reduce((sum, a) => sum + xpToPercent(aspects[a.key]), 0) / ASPECT_META.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">Report Perkembangan</p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Analisis Kesiapan Sekolah</h1>
            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Ringkasan XP dan capaian anak berdasarkan aktivitas yang telah diselesaikan.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[var(--forest-teal)] px-5 py-2 text-sm font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* ── Kolom Kiri: Ringkasan + Aspek ── */}
          <div className="space-y-5 lg:col-span-2">
            {/* Banner kesiapan */}
            <div className="rounded-3xl bg-[var(--forest-teal)] p-6 text-white">
              <p className="text-sm font-bold text-white/80">Ringkasan Kesiapan</p>
              <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <h2 className="text-5xl font-extrabold">
                    {totalXP === 0 ? "0%" : `${Math.round(avgPct)}%`}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                    {totalXP === 0
                      ? "Belum ada aktivitas yang diselesaikan. Mulai dengan AI Assessment, Flashcard, atau Video Edukasi untuk mendapatkan XP!"
                      : `${level.emoji} ${level.name} — Aira telah mengumpulkan ${totalXP} XP dari berbagai aktivitas. Lanjutkan stimulasi untuk meningkatkan skor kesiapan!`}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 px-5 py-4 text-center">
                  <p className="text-sm font-bold text-white/80">Total XP</p>
                  <p className="mt-1 text-3xl font-extrabold">{totalXP}</p>
                  <p className="text-xs text-white/70">{level.emoji} {level.name}</p>
                </div>
              </div>

              {/* Progress ke level berikutnya */}
              {nextLevel && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-white/70">
                    <span>{xpInLevel}/{xpNeeded} XP menuju {nextLevel.emoji} {nextLevel.name}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Level tracker */}
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-bold text-[var(--forest-teal)]">Jalur Level</p>
              <h2 className="mt-1 text-xl font-extrabold">3 Tingkat Kesiapan</h2>
              <div className="mt-4 flex items-center gap-3">
                {LEVELS.map((lv, i) => {
                  const isActive   = lv.id === level.id;
                  const isUnlocked = totalXP >= lv.minXP;
                  return (
                    <div key={lv.id} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={[
                          "flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm transition",
                          isActive   ? "scale-110 ring-4" : "",
                          isUnlocked ? "" : "opacity-35 grayscale",
                        ].join(" ")}
                        style={{
                          backgroundColor: lv.bg,
                          ...(isActive ? { outline: `3px solid ${lv.color}` } : {}),
                        }}
                      >
                        {lv.emoji}
                      </div>
                      <p className="text-center text-xs font-bold text-[var(--forest-navy)]">{lv.name}</p>
                      <p className="text-[10px] text-[var(--forest-navy)]/50">{lv.minXP}+ XP</p>
                      {isActive && (
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: lv.color }}>
                          Saat ini
                        </span>
                      )}
                      {/* Arrow between levels */}
                      {i < LEVELS.length - 1 && (
                        <div className="absolute" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aspek per sumber XP */}
            <div className="grid gap-4 md:grid-cols-2">
              {ASPECT_META.map((a) => {
                const xpVal = aspects[a.key];
                const pctVal = xpToPercent(xpVal);
                return (
                  <div key={a.key} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                        style={{ backgroundColor: a.color }}
                      >
                        {a.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--forest-teal)]">{a.label}</p>
                        <h3 className="text-3xl font-extrabold">{xpVal} <span className="text-base font-semibold text-[var(--forest-navy)]/50">XP</span></h3>
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#F3EFE3]">
                      <div
                        className="h-3 rounded-full transition-all duration-700"
                        style={{ width: `${pctVal}%`, backgroundColor: "#2A9D8F" }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs font-bold text-[var(--forest-navy)]/50">{pctVal}%</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/70">{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Kolom Kanan: Profil + Riwayat ── */}
          <div className="space-y-5">
            {/* Profil anak */}
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-bold text-[var(--forest-teal)]">Profil Anak</p>
              <div className="mt-3 rounded-3xl p-5" style={{ backgroundColor: level.bg }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/60 text-4xl">
                    {level.emoji}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold">Aira</h2>
                    <p className="text-sm font-semibold text-[var(--forest-navy)]/70">Usia 4 tahun</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3">
                  <p className="text-sm font-bold" style={{ color: level.color }}>
                    {level.emoji} Level: {level.name}
                  </p>
                  <p className="text-xs text-[var(--forest-navy)]/60">{totalXP} XP terkumpul</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--forest-sand)] p-4">
                <p className="text-sm font-bold text-[var(--forest-navy)]/70">Rekomendasi AI</p>
                <h3 className="mt-1 text-base font-extrabold">
                  {totalXP === 0
                    ? "Mulai aktivitas pertama!"
                    : aspects.motorik < aspects.kognitif
                    ? "Perbanyak latihan motorik"
                    : "Tingkatkan kosakata bahasa"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                  {totalXP === 0
                    ? "Coba AI Assessment untuk mendapatkan XP pertama. Setiap task yang berhasil memberi +20 XP!"
                    : "Gunakan AI Assessment dan Flashcard secara bergantian setiap sesi 10–15 menit."}
                </p>
              </div>
            </div>

            {/* Riwayat XP */}
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-bold text-[var(--forest-teal)]">Riwayat Aktivitas</p>
              <h2 className="mt-1 text-xl font-extrabold">Perolehan XP</h2>

              {history.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-[#F3EFE3] p-5 text-center">
                  <p className="text-3xl">📋</p>
                  <p className="mt-2 text-sm font-bold text-[var(--forest-navy)]/60">
                    Belum ada aktivitas
                  </p>
                  <p className="mt-1 text-xs text-[var(--forest-navy)]/45">
                    Selesaikan Assessment, Flashcard, atau Video Edukasi untuk melihat riwayat di sini.
                  </p>
                </div>
              ) : (
                <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {[...history].reverse().map((h, i) => {
                    const sourceIcon: Record<string, string> = {
                      assessment: "📷",
                      flashcard: "🃏",
                      video_correct: "🎬",
                      video_wrong: "🎬",
                    };
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-[#F3EFE3] px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{sourceIcon[h.source] ?? "⭐"}</span>
                          <div>
                            <p className="text-xs font-bold text-[var(--forest-navy)]">{h.label}</p>
                            <p className="text-[10px] text-[var(--forest-navy)]/50">
                              {new Date(h.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[var(--forest-teal)] px-2 py-0.5 text-xs font-extrabold text-white">
                          +{h.amount} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Panduan XP */}
            <div className="rounded-2xl bg-[#92A8D1]/30 p-4 ring-1 ring-[#92A8D1]/30">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--forest-navy)]/60">Cara Mendapat XP</p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { icon: "📷", label: "AI Assessment (per task)", xp: "+20 XP" },
                  { icon: "🃏", label: "Flashcard benar", xp: "+10 XP" },
                  { icon: "🃏", label: "Flashcard salah", xp: "+3 XP" },
                  { icon: "🎬", label: "Evaluasi video benar", xp: "+25 XP" },
                  { icon: "🎬", label: "Evaluasi video salah", xp: "+8 XP" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span>{r.icon} {r.label}</span>
                    <span className="font-extrabold text-[var(--forest-teal)]">{r.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}