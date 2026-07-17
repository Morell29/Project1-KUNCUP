"use client";

import Link from "next/link";
import { useState } from "react";
import PageDecorSimple from "@/components/PageDecorSimple";

// ─── Data ────────────────────────────────────────────────────────────────────
type Video = {
  id: string;
  title: string;
  duration: string;
  icon: string;
  desc: string;
  question: string;
  options: string[];
  answer: string;
  assessment: string;
};

type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  accent: string;
  videos: Video[];
};

const CATEGORIES: Category[] = [
  {
    id: "kognitif",
    label: "Kognitif Dasar",
    icon: "🧠",
    color: "#92A8D1",
    accent: "#264653",
    videos: [
      {
        id: "k1", title: "Mengenal Angka 1–5", duration: "4 mnt", icon: "🔢",
        desc: "Belajar menghitung benda lucu bersama karakter animasi.",
        question: "Berapa jumlah apel yang kamu lihat?",
        options: ["1", "3", "5", "7"], answer: "5",
        assessment: "Melatih kemampuan mengenal angka dan menghitung.",
      },
      {
        id: "k2", title: "Mengenal Warna Dasar", duration: "3 mnt", icon: "🎨",
        desc: "Eksplorasi merah, biru, kuning, hijau lewat benda sehari-hari.",
        question: "Warna apa yang ada pada daun?",
        options: ["Merah", "Biru", "Hijau", "Kuning"], answer: "Hijau",
        assessment: "Melatih kemampuan membedakan warna-warna dasar.",
      },
      {
        id: "k3", title: "Mengenal Bentuk Dasar", duration: "3 mnt", icon: "🔷",
        desc: "Lingkaran, segitiga, kotak lewat benda nyata di sekitar rumah.",
        question: "Bentuk apa yang ada pada roda?",
        options: ["Kotak", "Segitiga", "Lingkaran", "Bintang"], answer: "Lingkaran",
        assessment: "Melatih pengenalan bentuk geometri dasar.",
      },
    ],
  },
  {
    id: "pendengaran",
    label: "Pendengaran",
    icon: "👂",
    color: "#F7CAC9",
    accent: "#FF6F61",
    videos: [
      {
        id: "p1", title: "Suara Hewan", duration: "3 mnt", icon: "🐾",
        desc: "Anak mendengar suara kucing, anjing, sapi, dan ayam.",
        question: "Hewan apa yang bersuara meong?",
        options: ["Ayam", "Kucing", "Sapi", "Kuda"], answer: "Kucing",
        assessment: "Melatih kemampuan membedakan suara hewan.",
      },
      {
        id: "p2", title: "Bunyi Alam", duration: "4 mnt", icon: "🌊",
        desc: "Suara hujan, angin, dan gemericik air untuk stimulasi auditif.",
        question: "Suara apa yang terdengar saat hujan turun?",
        options: ["Gemerisik", "Tik-tik", "Deru", "Dentuman"], answer: "Tik-tik",
        assessment: "Melatih kepekaan pendengaran terhadap alam.",
      },
      {
        id: "p3", title: "Keras & Lembut", duration: "3 mnt", icon: "🔔",
        desc: "Anak membandingkan suara keras dan pelan dalam aktivitas seru.",
        question: "Manakah suara yang keras?",
        options: ["Berbisik", "Berdrum", "Bernyanyi pelan", "Mengobrol"], answer: "Berdrum",
        assessment: "Melatih kemampuan membedakan intensitas suara.",
      },
    ],
  },
  {
    id: "bahasa",
    label: "Bahasa",
    icon: "💬",
    color: "#E9C46A",
    accent: "#F4A261",
    videos: [
      {
        id: "b1", title: "Ekspresi Wajah", duration: "5 mnt", icon: "😊",
        desc: "Anak belajar mengenali dan meniru ekspresi senang, sedih, marah.",
        question: "Ekspresi apa saat tersenyum?",
        options: ["Sedih", "Marah", "Senang", "Takut"], answer: "Senang",
        assessment: "Melatih pengenalan emosi dan ekspresi wajah.",
      },
      {
        id: "b2", title: "Kosakata Buah", duration: "4 mnt", icon: "🍎",
        desc: "Belajar menyebut nama-nama buah lewat gambar berwarna.",
        question: "Buah apa yang berwarna kuning dan manis?",
        options: ["Apel", "Pisang", "Anggur", "Pepaya"], answer: "Pisang",
        assessment: "Memperkaya kosakata dasar anak tentang buah.",
      },
      {
        id: "b3", title: "Instruksi Sederhana", duration: "4 mnt", icon: "📢",
        desc: "Anak mengikuti instruksi bertahap: angkat tangan, duduk, dll.",
        question: "Apa yang harus dilakukan saat 'tepuk tangan'?",
        options: ["Diam", "Berteriak", "Bertepuk", "Melompat"], answer: "Bertepuk",
        assessment: "Melatih respons terhadap instruksi verbal.",
      },
    ],
  },
  {
    id: "sosial",
    label: "Sosial",
    icon: "🤝",
    color: "#C5E1A5",
    accent: "#88B04B",
    videos: [
      {
        id: "s1", title: "Belajar Berbagi", duration: "4 mnt", icon: "🎁",
        desc: "Kisah dua anak yang belajar berbagi mainan dengan gembira.",
        question: "Apa yang dilakukan tokoh saat temannya ingin mainan?",
        options: ["Menyembunyikan", "Berbagi", "Menangis", "Berlari"], answer: "Berbagi",
        assessment: "Mengenalkan nilai berbagi dan empati.",
      },
      {
        id: "s2", title: "Bermain Bersama", duration: "3 mnt", icon: "🧩",
        desc: "Teman-teman bekerja sama menyusun puzzle yang seru.",
        question: "Apa yang membuat permainan lebih menyenangkan?",
        options: ["Bermain sendiri", "Bekerja sama", "Bersaing", "Menang"], answer: "Bekerja sama",
        assessment: "Mendorong kemampuan kerja sama.",
      },
      {
        id: "s3", title: "Terima Kasih", duration: "3 mnt", icon: "🙏",
        desc: "Kisah tentang pentingnya mengucapkan terima kasih dan tolong.",
        question: "Kata apa yang diucapkan saat menerima bantuan?",
        options: ["Halo", "Maaf", "Terima kasih", "Permisi"], answer: "Terima kasih",
        assessment: "Mengenalkan nilai sopan santun.",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function VideoPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCat, setSelectedCat]     = useState<Category | null>(null);
  const [quizAnswer, setQuizAnswer]       = useState("");
  const [feedback, setFeedback]           = useState("");

  function openVideo(video: Video, cat: Category) {
    setSelectedVideo(video);
    setSelectedCat(cat);
    setQuizAnswer("");
    setFeedback("");
  }

  function closeModal() {
    setSelectedVideo(null);
    setSelectedCat(null);
    setQuizAnswer("");
    setFeedback("");
  }

  function checkAnswer(opt: string) {
    if (!selectedVideo) return;
    setQuizAnswer(opt);
    setFeedback(
      opt === selectedVideo.answer
        ? "Benar! Anak memahami isi video dengan baik 🎉"
        : `Belum tepat. Jawaban yang benar adalah "${selectedVideo.answer}".`
    );
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[var(--kuncup-bg)] text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 flex h-full flex-col px-6 pt-5 pb-4 mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--forest-teal)]">Video Edukasi</p>
            <h1 className="mt-0.5 text-2xl font-extrabold">Belajar Lewat Video Pendek</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[var(--forest-teal)] px-4 py-1.5 text-sm font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white"
          >
            Dashboard
          </Link>
        </div>

        {/* ── 4 Baris Kategori ── */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex min-h-0 flex-1 items-stretch gap-3">

              {/* Label kategori */}
              <div
                className="hidden w-[88px] shrink-0 flex-col items-center justify-center rounded-2xl p-3 text-center lg:flex"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="mt-1 text-[11px] font-extrabold leading-tight text-[var(--forest-navy)]">
                  {cat.label}
                </p>
              </div>

              {/* 3 Video cards */}
              {cat.videos.map((video) => (
                <button
                  key={video.id}
                  id={`video-${video.id}`}
                  onClick={() => openVideo(video, cat)}
                  className="group relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl p-4 text-left shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ backgroundColor: cat.color }}
                >
                  {/* Accent blob */}
                  <div
                    className="absolute -right-3 -top-3 h-14 w-14 rounded-full opacity-25"
                    style={{ backgroundColor: cat.accent }}
                  />

                  {/* ── Play overlay — z-20 + backdrop blur ── */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:backdrop-blur-[2px]">
                    <div
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: `${cat.accent}dd` }}
                    >
                      <span>▶</span>
                      <span>Putar</span>
                    </div>
                  </div>

                  {/* Content — z-10, tertimpa play overlay saat hover */}
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-xl shadow-sm">
                        {video.icon}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--forest-navy)]/55">
                        {video.duration}
                      </p>
                      <h3 className="mt-0.5 text-sm font-extrabold leading-snug text-[var(--forest-navy)]">
                        {video.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--forest-navy)]/65">
                        {video.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Kotak "Video Lainnya" → ke gallery */}
              <Link
                href={`/video/${cat.id}`}
                id={`more-${cat.id}`}
                className="group relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: `${cat.accent}66`, backgroundColor: `${cat.color}40` }}
              >
                {/* Animated bg blob */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ backgroundColor: `${cat.color}80` }}
                />
                <div className="relative z-10">
                  <div
                    className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl text-2xl font-bold transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}` }}
                  >
                    +
                  </div>
                  <p className="text-xs font-extrabold text-[var(--forest-navy)]/70">
                    Video Lainnya
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--forest-navy)]/45">
                    Lihat semua →
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ Modal Video ══════════════════════════════ */}
      {selectedVideo && selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              id="btn-close-modal"
              onClick={closeModal}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-sm transition hover:bg-black/20"
              aria-label="Tutup"
            >✕</button>

            {/* Header video */}
            <div className="relative flex aspect-video items-center justify-center" style={{ backgroundColor: selectedCat.color }}>
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-35" style={{ backgroundColor: selectedCat.accent }} />

              {/* Fullscreen icon pojok kanan bawah */}
              <button
                className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/30 text-white transition hover:bg-black/50"
                title="Layar penuh"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              <div className="relative z-10 text-center px-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 text-4xl shadow-md">
                  {selectedVideo.icon}
                </div>
                <p className="mt-2 text-xs font-bold text-[var(--forest-navy)]/65">
                  {selectedCat.label} · {selectedVideo.duration}
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-[var(--forest-navy)]">
                  {selectedVideo.title}
                </h2>
                <p className="mt-0.5 text-[11px] text-[var(--forest-navy)]/50">
                  Area ini dapat diganti dengan embed video asli.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-sm leading-relaxed text-[var(--forest-navy)]/70">{selectedVideo.desc}</p>

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--forest-teal)]">Evaluasi Singkat</p>
                <p className="mt-1 text-sm font-extrabold text-[var(--forest-navy)]">{selectedVideo.question}</p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {selectedVideo.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => checkAnswer(opt)}
                      className={[
                        "rounded-xl px-3 py-2.5 text-left text-xs font-bold transition",
                        quizAnswer === opt
                          ? opt === selectedVideo.answer ? "bg-green-500 text-white" : "bg-red-400 text-white"
                          : "bg-[var(--kuncup-bg)] text-[var(--forest-navy)] hover:bg-[var(--forest-sand)]/60",
                      ].join(" ")}
                    >{opt}</button>
                  ))}
                </div>
                {feedback && (
                  <div className={["mt-2.5 rounded-xl px-3 py-2 text-xs font-semibold", feedback.startsWith("Benar") ? "bg-green-100 text-green-800" : "bg-red-50 text-red-700"].join(" ")}>
                    {feedback}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2.5">
                <Link href="/assessment" id="btn-mulai-asesmen" className="flex-1 rounded-full bg-[var(--forest-teal)] py-2.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-[var(--forest-navy)]">
                  🎯 Mulai Asesmen
                </Link>
                <button onClick={closeModal} className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-bold text-[var(--forest-navy)]/55 transition hover:bg-black/5">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}