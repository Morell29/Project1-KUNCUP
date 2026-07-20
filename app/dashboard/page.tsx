"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageOrnaments from "@/components/PageOrnaments";
import { readXP, getLevelProgress, type XPState } from "@/lib/xp";

// ─── Countdown 1 jam (decoy) ──────────────────────────────────────────────────
function useCountdown(totalSeconds = 3600) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((s) => (s <= 1 ? totalSeconds : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [totalSeconds]);

  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Hitung aktivitas hari ini dari riwayat XP ────────────────────────────────
function todayActivityCount(xp: XPState | null): number {
  if (!xp) return 0;
  const today = new Date().toDateString();
  const seen  = new Set<string>();
  for (const h of xp.history) {
    if (new Date(h.timestamp).toDateString() === today) seen.add(h.label);
  }
  return Math.min(5, seen.size);
}

// ─── Rata-rata kesiapan dari aspek XP ────────────────────────────────────────
function overallReadiness(xp: XPState | null): number {
  if (!xp || xp.total === 0) return 0;
  const max = 300;
  const avg = Object.values(xp.aspects).reduce((s, v) => s + v, 0) / 4;
  return Math.min(100, Math.round((avg / max) * 100));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const countdown  = useCountdown(3600);
  const [xp, setXP] = useState<XPState | null>(null);

  // Baca XP dari localStorage dan subscribe ke update
  useEffect(() => {
    setXP(readXP());
    function onUpdate(e: Event) {
      setXP((e as CustomEvent<XPState>).detail);
    }
    window.addEventListener("xp-update", onUpdate);
    return () => window.removeEventListener("xp-update", onUpdate);
  }, []);

  const { level, pct } = getLevelProgress(xp?.total ?? 0);
  const activityCount  = todayActivityCount(xp);
  const readinessPct   = overallReadiness(xp);

  const features = [
    {
      title: "AI Assessment",
      description: "Latihan gerakan interaktif dengan kamera.",
      href: "/assessment",
      icon: "📷",
      bg: "#92A8D1",
      accent: "#264653",
      text: "#264653",
      muted: "rgba(38, 70, 83, 0.75)",
    },
    {
      title: "Flashcard",
      description: "Belajar suara hewan, angka, warna, dan bentuk.",
      href: "/flashcard",
      icon: "🃏",
      bg: "#F7CAC9",
      accent: "#FF6F61",
      text: "#264653",
      muted: "rgba(38, 70, 83, 0.75)",
    },
    {
      title: "Video Edukasi",
      description: "Video pendek dengan evaluasi singkat.",
      href: "/video",
      icon: "🎬",
      bg: "#6B5B93",
      accent: "#F9C74F",
      text: "#FFFFFF",
      muted: "rgba(255, 255, 255, 0.82)",
    },
    {
      title: "Worksheet",
      description: "Unduh lembar latihan tracing dan pola.",
      href: "/worksheet",
      icon: "✏️",
      bg: "#F4A261",
      accent: "#FF6F61",
      text: "#264653",
      muted: "rgba(38, 70, 83, 0.75)",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageOrnaments />

      <section className="relative z-10 mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">Dashboard Orang Tua</p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Halo, Bunda Mpruy 👋
            </h1>
            <p className="mt-1 text-[var(--forest-navy)]/70">
              Pantau aktivitas belajar dan kesiapan sekolah Aira hari ini.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--forest-teal)] px-5 py-2 text-sm font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white"
          >
            Kembali
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Profil anak — level dari XP */}
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: level.bg }}
              >
                {level.emoji}
              </div>
              <div>
                <p className="text-sm text-[var(--forest-navy)]/65">Profil Anak</p>
                <h2 className="text-xl font-extrabold">Aira</h2>
                <p className="text-sm text-[var(--forest-navy)]/65">Usia 4 tahun</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl px-3 py-2" style={{ backgroundColor: `${level.color}22` }}>
              <p className="text-sm font-bold" style={{ color: level.color }}>
                {level.emoji} Level: {level.name}
              </p>
              {/* Mini XP progress */}
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: level.color }}
                />
              </div>
              <p className="mt-0.5 text-right text-[10px] text-[var(--forest-navy)]/50">
                {xp?.total ?? 0} XP · {pct}%
              </p>
            </div>
          </div>

          {/* Progress harian — dari riwayat XP hari ini */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#88B04B] text-2xl">
              ✅
            </div>
            <div>
              <p className="text-sm text-[var(--forest-navy)]/65">Progress Hari Ini</p>
              <h2 className="text-xl font-extrabold">{activityCount}/5 Aktivitas</h2>
              <p className="text-sm text-[var(--forest-navy)]/65">
                {activityCount === 0
                  ? "Belum ada aktivitas hari ini"
                  : activityCount >= 5
                  ? "Target harian tercapai! 🎉"
                  : `${5 - activityCount} lagi untuk target harian`}
              </p>
            </div>
          </div>

          {/* Countdown batas penggunaan */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9C46A] text-2xl">
              ⏳
            </div>
            <div>
              <p className="text-sm text-[var(--forest-navy)]/65">Batas Penggunaan</p>
              <h2 className="font-mono text-xl font-extrabold tracking-widest">
                {countdown}
              </h2>
              <p className="text-sm text-[var(--forest-navy)]/65">Sisa waktu hari ini</p>
            </div>
          </div>

          {/* Report — kesiapan dinamis */}
          <Link
            href="/report"
            className="rounded-2xl bg-[var(--forest-teal)] p-4 text-white shadow-sm transition hover:-translate-y-1 hover:bg-[var(--forest-navy)] hover:shadow-md"
          >
            <p className="text-sm text-white/80">Ringkasan Report</p>
            <h2 className="mt-1 text-xl font-extrabold">
              Kesiapan {readinessPct}%
            </h2>
            <p className="mt-1 text-sm text-white/80">
              {readinessPct === 0
                ? "Mulai aktivitas untuk melihat perkembangan."
                : readinessPct < 50
                ? "Terus semangat melatih si kecil!"
                : "Perkembangan yang baik, lanjutkan!"}
            </p>
            <p className="mt-3 text-sm font-bold">Lihat Detail →</p>
          </Link>
        </div>

        {/* ── Rekomendasi ── */}
        <div className="mt-5 rounded-2xl bg-[var(--forest-sand)]/90 p-5 shadow-sm ring-1 ring-[var(--forest-sand)]">
          <p className="text-sm font-bold text-[var(--forest-navy)]/70">Rekomendasi Hari Ini</p>
          <h2 className="mt-1 text-xl font-extrabold">
            {xp?.total === 0 || !xp
              ? "Mulai aktivitas pertama bersama Aira!"
              : "Latihan mengenal anggota tubuh"}
          </h2>
          <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--forest-navy)]/75">
            {xp?.total === 0 || !xp
              ? "Coba mulai dengan AI Assessment atau Flashcard. Setiap aktivitas yang diselesaikan akan memberikan XP dan meningkatkan level Aira."
              : "Ajak anak mengikuti instruksi sederhana seperti menunjuk hidung, memegang telinga, dan mengangkat tangan untuk melatih pemahaman instruksi serta koordinasi gerak."}
          </p>
        </div>

        {/* ── Fitur Aktivitas ── */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Fitur Aktivitas</h2>
          <p className="text-sm text-[var(--forest-navy)]/65">
            Pilih aktivitas pendampingan anak
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl p-5 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              style={{ backgroundColor: feature.bg, color: feature.text }}
            >
              <div
                className="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-80 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.accent }}
              />
              <div className="absolute inset-0 -translate-x-full rounded-2xl bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/55 text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-extrabold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: feature.muted }}>
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}