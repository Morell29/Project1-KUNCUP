"use client";

import Link from "next/link";
import { useState } from "react";
import { use } from "react";
import PageDecorSimple from "@/components/PageDecorSimple";

// ─── Data Kategori ────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, {
  label: string; icon: string; color: string; accent: string;
}> = {
  kognitif:    { label: "Kognitif Dasar",  icon: "🧠", color: "#92A8D1", accent: "#264653" },
  pendengaran: { label: "Pendengaran",     icon: "👂", color: "#F7CAC9", accent: "#FF6F61" },
  bahasa:      { label: "Bahasa",          icon: "💬", color: "#E9C46A", accent: "#F4A261" },
  sosial:      { label: "Sosial",          icon: "🤝", color: "#C5E1A5", accent: "#88B04B" },
};

// Data 3 video yang bisa dibuka per kategori
const UNLOCKED_VIDEOS: Record<string, { icon: string; title: string; duration: string; desc: string }[]> = {
  kognitif: [
    { icon: "🔢", title: "Mengenal Angka 1–5",    duration: "4 mnt", desc: "Belajar menghitung benda lucu bersama karakter animasi." },
    { icon: "🎨", title: "Mengenal Warna Dasar",  duration: "3 mnt", desc: "Eksplorasi merah, biru, kuning, hijau lewat benda sehari-hari." },
    { icon: "🔷", title: "Mengenal Bentuk Dasar", duration: "3 mnt", desc: "Lingkaran, segitiga, kotak lewat benda nyata di sekitar rumah." },
  ],
  pendengaran: [
    { icon: "🐾", title: "Suara Hewan",        duration: "3 mnt", desc: "Anak mendengar suara kucing, anjing, sapi, dan ayam." },
    { icon: "🌊", title: "Bunyi Alam",          duration: "4 mnt", desc: "Suara hujan, angin, dan gemericik air untuk stimulasi auditif." },
    { icon: "🔔", title: "Keras & Lembut",      duration: "3 mnt", desc: "Anak membandingkan suara keras dan pelan dalam aktivitas seru." },
  ],
  bahasa: [
    { icon: "😊", title: "Ekspresi Wajah",      duration: "5 mnt", desc: "Anak belajar mengenali dan meniru ekspresi senang, sedih, marah." },
    { icon: "🍎", title: "Kosakata Buah",        duration: "4 mnt", desc: "Belajar menyebut nama-nama buah lewat gambar berwarna." },
    { icon: "📢", title: "Instruksi Sederhana",  duration: "4 mnt", desc: "Anak mengikuti instruksi bertahap: angkat tangan, duduk, dll." },
  ],
  sosial: [
    { icon: "🎁", title: "Belajar Berbagi",     duration: "4 mnt", desc: "Kisah dua anak yang belajar berbagi mainan dengan gembira." },
    { icon: "🧩", title: "Bermain Bersama",      duration: "3 mnt", desc: "Teman-teman bekerja sama menyusun puzzle yang seru." },
    { icon: "🙏", title: "Terima Kasih",         duration: "3 mnt", desc: "Kisah tentang pentingnya mengucapkan terima kasih dan tolong." },
  ],
};

// Icon & judul untuk 17 video yang terkunci (sama untuk semua kategori, decoy)
const LOCKED_DECOY = [
  { icon: "🌟", title: "Pola & Urutan" },
  { icon: "🔍", title: "Mencari Perbedaan" },
  { icon: "🧮", title: "Angka 6–10" },
  { icon: "🗺️", title: "Arah & Posisi" },
  { icon: "⏰", title: "Konsep Waktu" },
  { icon: "🌈", title: "Campuran Warna" },
  { icon: "📐", title: "Ukuran & Besar Kecil" },
  { icon: "🎵", title: "Irama & Ketukan" },
  { icon: "🧪", title: "Sebab & Akibat" },
  { icon: "🦋", title: "Siklus Hidup" },
  { icon: "🌿", title: "Alam & Lingkungan" },
  { icon: "🏠", title: "Bagian Rumah" },
  { icon: "🚀", title: "Benda Langit" },
  { icon: "🐠", title: "Hewan Laut" },
  { icon: "🌏", title: "Negara & Budaya" },
  { icon: "🎭", title: "Peran & Profesi" },
  { icon: "💡", title: "Kreasi & Inovasi" },
];

// ─── Modal Unlock Video ───────────────────────────────────────────────────────
type ModalVideo = { icon: string; title: string; duration: string; desc: string; index: number };

function VideoModal({
  video, cat, onClose,
}: {
  video: ModalVideo;
  cat: { label: string; icon: string; color: string; accent: string };
  onClose: () => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className={[
        "relative z-10 overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300",
        fullscreen ? "h-screen w-screen rounded-none" : "w-full max-w-md",
      ].join(" ")}>
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-sm transition hover:bg-black/20"
          aria-label="Tutup"
        >✕</button>

        {/* Preview / player */}
        <div
          className={["relative flex items-center justify-center", fullscreen ? "h-full" : "aspect-video"].join(" ")}
          style={{ backgroundColor: cat.color }}
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-35" style={{ backgroundColor: cat.accent }} />

          {/* Fullscreen toggle pojok kanan bawah */}
          <button
            onClick={() => setFullscreen((f) => !f)}
            className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/30 text-white transition hover:bg-black/50"
            title={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
          >
            {fullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0v4m0-4h4m6 0l5-5m0 0v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m6 0l5 5m0 0v-4m0 4h-4" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>

          <div className="relative z-10 text-center px-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 text-4xl shadow-md">
              {video.icon}
            </div>
            <p className="mt-2 text-xs font-bold text-[var(--forest-navy)]/65">
              {cat.label} · {video.duration}
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[var(--forest-navy)]">{video.title}</h2>
            <p className="mt-0.5 text-[11px] text-[var(--forest-navy)]/50">
              Area ini dapat diganti dengan embed video asli.
            </p>
          </div>
        </div>

        {/* Body */}
        {!fullscreen && (
          <div className="p-5">
            <p className="text-sm leading-relaxed text-[var(--forest-navy)]/70">{video.desc}</p>
            <div className="mt-4 flex gap-2.5">
              <Link
                href="/assessment"
                className="flex-1 rounded-full bg-[var(--forest-teal)] py-2.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-[var(--forest-navy)]"
              >
                🎯 Mulai Asesmen
              </Link>
              <button
                onClick={onClose}
                className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-bold text-[var(--forest-navy)]/55 transition hover:bg-black/5"
              >Tutup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gallery Page ─────────────────────────────────────────────────────────────
export default function CategoryGalleryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);
  const cat = CATEGORY_META[categoryId];

  const [activeVideo, setActiveVideo] = useState<ModalVideo | null>(null);

  if (!cat) {
    return (
      <main className="flex h-screen items-center justify-center bg-[var(--kuncup-bg)]">
        <div className="text-center">
          <p className="text-6xl">🔍</p>
          <h1 className="mt-4 text-2xl font-extrabold text-[var(--forest-navy)]">Kategori tidak ditemukan</h1>
          <Link href="/video" className="mt-4 inline-block rounded-full bg-[var(--forest-teal)] px-6 py-2 font-bold text-white">
            Kembali
          </Link>
        </div>
      </main>
    );
  }

  const unlockedList = UNLOCKED_VIDEOS[categoryId] ?? [];
  // Gabungkan 3 unlock + 17 locked = 20 total
  const allVideos = [
    ...unlockedList.map((v, i) => ({ ...v, index: i, locked: false })),
    ...LOCKED_DECOY.map((v, i) => ({ ...v, duration: `${3 + (i % 4)} mnt`, desc: "", index: unlockedList.length + i, locked: true })),
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--forest-teal)]">Video Edukasi</p>
              <h1 className="mt-0.5 text-2xl font-extrabold">{cat.label}</h1>
              <p className="text-sm text-[var(--forest-navy)]/60">
                {unlockedList.length} video tersedia · {LOCKED_DECOY.length} video terkunci
              </p>
            </div>
          </div>
          <Link
            href="/video"
            className="rounded-full border border-[var(--forest-teal)] px-4 py-1.5 text-sm font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white"
          >
            ← Kembali
          </Link>
        </div>

        {/* Level notice */}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--forest-sand)] text-xl">🔓</div>
          <div>
            <p className="text-sm font-extrabold text-[var(--forest-navy)]">Level Kuncup Ceria — 3 video tersedia</p>
            <p className="text-xs text-[var(--forest-navy)]/60">
              Selesaikan lebih banyak aktivitas untuk membuka video selanjutnya.
            </p>
          </div>
          <div className="ml-auto rounded-full bg-[var(--forest-teal)] px-3 py-1 text-xs font-bold text-white">
            Level 1
          </div>
        </div>

        {/* Grid 20 video */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allVideos.map((video) =>
            video.locked ? (
              /* ── Video Terkunci ── */
              <div
                key={video.index}
                className="relative flex flex-col overflow-hidden rounded-2xl p-4 ring-1 ring-black/5"
                style={{ backgroundColor: `${cat.color}40` }}
              >
                {/* Overlay gelap */}
                <div className="absolute inset-0 rounded-2xl bg-[var(--forest-navy)]/45 backdrop-grayscale" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl grayscale">
                    {video.icon}
                  </div>
                  <p className="text-xs font-bold leading-snug text-white/80">{video.title}</p>
                  {/* Lock badge */}
                  <div className="mt-1 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V7a3 3 0 016 0v4" />
                    </svg>
                    <span className="text-[9px] font-bold text-white/70">Level belum cukup</span>
                  </div>
                </div>

                {/* Nomor video */}
                <div className="absolute right-2 top-2 z-10 rounded-full bg-black/30 px-1.5 py-0.5 text-[9px] font-bold text-white/70">
                  #{video.index + 1}
                </div>
              </div>
            ) : (
              /* ── Video Terbuka ── */
              <button
                key={video.index}
                id={`gallery-video-${video.index}`}
                onClick={() => setActiveVideo(video as ModalVideo)}
                className="group relative flex flex-col overflow-hidden rounded-2xl p-4 text-left shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: cat.color }}
              >
                {/* Accent blob */}
                <div className="absolute -right-2 -top-2 h-10 w-10 rounded-full opacity-30" style={{ backgroundColor: cat.accent }} />

                {/* Play overlay on hover */}
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:backdrop-blur-[2px]">
                  <div className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg" style={{ backgroundColor: `${cat.accent}dd` }}>
                    <span>▶</span> Putar
                  </div>
                </div>

                {/* Fullscreen hint */}
                <div className="absolute bottom-2 right-2 z-10 flex h-5 w-5 items-center justify-center rounded-md bg-black/20 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-2xl shadow-sm">
                    {video.icon}
                  </div>
                  <p className="text-[10px] font-bold text-[var(--forest-navy)]/50">{video.duration}</p>
                  <h3 className="mt-0.5 text-xs font-extrabold leading-snug text-[var(--forest-navy)]">
                    {video.title}
                  </h3>
                </div>

                {/* Nomor video */}
                <div className="absolute right-2 top-2 rounded-full bg-white/50 px-1.5 py-0.5 text-[9px] font-bold text-[var(--forest-navy)]/60">
                  #{video.index + 1}
                </div>
              </button>
            )
          )}
        </div>
      </section>

      {/* Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} cat={cat} onClose={() => setActiveVideo(null)} />
      )}
    </main>
  );
}
