"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageOrnaments from "@/components/PageOrnaments";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleGuest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 900);
  }

  return (
    /* h-screen + overflow-hidden → tepat satu layar, tidak ada scroll */
    <main className="relative h-screen overflow-hidden bg-[var(--kuncup-bg)] text-[var(--forest-navy)]">
      <PageOrnaments />

      <section className="relative z-10 flex h-full items-center justify-center px-6">
        {/* Layout dua kolom: kiri = branding, kanan = form */}
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">

          {/* ── Kolom Kiri: Branding ── */}
          <div className="text-center md:text-left">
            {/* Badge */}
            <span className="inline-block rounded-full bg-[var(--forest-sand)]/80 px-4 py-1.5 text-xs font-semibold text-[var(--forest-navy)] shadow-sm">
              Platform kesiapan sekolah anak usia 2–5 tahun
            </span>

            {/* Logo */}
            <h1 className="mt-4 text-6xl font-extrabold tracking-tight leading-none lg:text-7xl">
              KUNCUP
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--forest-navy)]/65 lg:text-base">
              Membantu orang tua menstimulasi, memantau, dan memahami
              kesiapan anak sebelum memasuki pendidikan formal melalui
              aktivitas interaktif berbasis teknologi.
            </p>

            {/* Dot ornaments */}
            <div className="mt-6 flex justify-center gap-2.5 md:justify-start">
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--rainbow-coral)]" />
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--forest-yellow)]" />
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--rainbow-green)]" />
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--rainbow-blue)]" />
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--rainbow-purple)]" />
            </div>

            {/* Fitur highlight (hanya desktop) */}
            <div className="mt-7 hidden grid-cols-2 gap-3 md:grid">
              {[
                { icon: "🎯", text: "AI Assessment Real-time" },
                { icon: "🎬", text: "Video Edukasi Interaktif" },
                { icon: "📊", text: "Pantau Perkembangan" },
                { icon: "🤝", text: "Aktivitas Motorik" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-xs font-semibold text-[var(--forest-navy)] shadow-sm ring-1 ring-black/5"
                >
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Kolom Kanan: Form Login ── */}
          <div className="mx-auto w-full max-w-sm md:mx-0">
            <div className="rounded-3xl bg-white/85 p-7 shadow-[0_16px_48px_rgba(38,70,83,0.13)] ring-1 ring-white/70 backdrop-blur-md">
              {/* Header form */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--forest-teal)]">
                Masuk ke Akun
              </p>
              <h2 className="mt-0.5 text-xl font-extrabold text-[var(--forest-navy)]">
                Selamat Datang! 👋
              </h2>

              <form onSubmit={handleGuest} className="mt-5 space-y-3">
                {/* Input nama (decoy) */}
                <div>
                  <label
                    htmlFor="login-name"
                    className="mb-1 block text-[11px] font-bold text-[var(--forest-navy)]/55"
                  >
                    Nama Orang Tua / Pendamping
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    placeholder="Nama Anda..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--kuncup-bg)] px-3.5 py-2 text-sm text-[var(--forest-navy)] placeholder-black/25 outline-none transition focus:border-[var(--forest-teal)] focus:ring-2 focus:ring-[var(--forest-teal)]/20"
                  />
                </div>

                {/* Input password (decoy) */}
                <div>
                  <label
                    htmlFor="login-pass"
                    className="mb-1 block text-[11px] font-bold text-[var(--forest-navy)]/55"
                  >
                    Kata Sandi
                  </label>
                  <input
                    id="login-pass"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-black/10 bg-[var(--kuncup-bg)] px-3.5 py-2 text-sm text-[var(--forest-navy)] placeholder-black/25 outline-none transition focus:border-[var(--forest-teal)] focus:ring-2 focus:ring-[var(--forest-teal)]/20"
                  />
                </div>

                {/* Tombol Masuk (decoy) */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="w-full rounded-xl border border-black/10 bg-white py-2 text-sm font-bold text-[var(--forest-navy)]/40 transition hover:bg-gray-50"
                >
                  Masuk
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-black/10" />
                  <span className="text-[11px] font-semibold text-[var(--forest-navy)]/35">
                    atau
                  </span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>

                {/* Tombol Tamu (aktif) */}
                <button
                  id="btn-masuk-tamu"
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest-teal)] py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--forest-navy)] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Memuat…
                    </>
                  ) : (
                    <>
                      <span>👤</span>
                      Lanjutkan sebagai Tamu
                    </>
                  )}
                </button>
              </form>

              <p className="mt-3.5 text-center text-[10px] leading-relaxed text-[var(--forest-navy)]/35">
                Akun tamu tidak menyimpan data secara permanen.
                <br />Untuk fitur lengkap, daftarkan akun Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}