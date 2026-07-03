"use client";

import Link from "next/link";
import { useState } from "react";
import PageDecorSimple from "@/components/PageDecorSimple";

export default function VideoPage() {
  const videos = [
    {
      title: "Mengenal Angka 1 sampai 5",
      category: "Kognitif Dasar",
      duration: "4 menit",
      icon: "🔢",
      bg: "#92A8D1",
      accent: "#264653",
      question: "Berapa jumlah apel yang kamu lihat?",
      options: ["1", "3", "5", "7"],
      answer: "5",
      assessment: "Melatih kemampuan mengenal angka dan menghitung benda.",
    },
    {
      title: "Mengenal Suara Hewan",
      category: "Pendengaran",
      duration: "3 menit",
      icon: "🐾",
      bg: "#F7CAC9",
      accent: "#FF6F61",
      question: "Hewan apa yang bersuara meong?",
      options: ["Ayam", "Kucing", "Sapi", "Kuda"],
      answer: "Kucing",
      assessment: "Melatih kemampuan membedakan suara dan mengenali hewan.",
    },
    {
      title: "Menirukan Ekspresi Wajah",
      category: "Bahasa & Sosial",
      duration: "5 menit",
      icon: "😊",
      bg: "#F9C74F",
      accent: "#F4A261",
      question: "Ekspresi apa yang ditunjukkan saat tersenyum?",
      options: ["Sedih", "Marah", "Senang", "Takut"],
      answer: "Senang",
      assessment: "Melatih pengenalan emosi dan ekspresi wajah.",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const selectedVideo = videos[selectedIndex];

  function chooseVideo(index: number) {
    setSelectedIndex(index);
    setShowQuiz(false);
    setSelectedAnswer("");
    setFeedback("");
  }

  function startQuiz() {
    setShowQuiz(true);
    setSelectedAnswer("");
    setFeedback("");
  }

  function checkAnswer(answer: string) {
    setSelectedAnswer(answer);

    if (answer === selectedVideo.answer) {
      setFeedback("Benar! Anak memahami isi video dengan baik 🎉");
    } else {
      setFeedback(
        `Belum tepat. Jawaban yang benar adalah ${selectedVideo.answer}.`
      );
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Video Edukasi
            </p>

            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Belajar Lewat Video Pendek
            </h1>

            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Anak menonton video edukasi singkat, lalu menjawab evaluasi
              sederhana untuk melihat pemahaman setelah belajar.
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
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:col-span-2">
            <div
              className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl p-6 text-center"
              style={{
                backgroundColor: selectedVideo.bg,
                color: "var(--forest-navy)",
              }}
            >
              <div
                className="absolute right-0 top-0 h-32 w-32 rounded-bl-full opacity-80"
                style={{ backgroundColor: selectedVideo.accent }}
              />

              <div className="relative z-10">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/55 text-6xl shadow-sm">
                  {selectedVideo.icon}
                </div>

                <p className="mt-5 text-sm font-bold opacity-80">
                  {selectedVideo.category} • {selectedVideo.duration}
                </p>

                <h2 className="mt-2 text-3xl font-extrabold">
                  {selectedVideo.title}
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed opacity-80">
                  Area ini nantinya dapat diganti dengan video asli atau embed
                  YouTube edukasi.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-[#E9C46A] p-5">
                <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                  Tujuan Aktivitas
                </p>

                <h3 className="mt-1 text-xl font-extrabold">
                  Evaluasi Setelah Menonton
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                  {selectedVideo.assessment}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Status Video
                </p>

                <h3 className="mt-1 text-xl font-extrabold">Siap Ditonton</h3>

                <p className="mt-2 text-sm text-[var(--forest-navy)]/70">
                  Setelah anak selesai menonton, lanjutkan dengan evaluasi
                  singkat.
                </p>

                <button
                  onClick={startQuiz}
                  className="mt-4 rounded-full bg-[var(--forest-teal)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-navy)]"
                >
                  Mulai Evaluasi
                </button>
              </div>
            </div>

            {showQuiz && (
              <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Evaluasi Singkat
                </p>

                <h2 className="mt-1 text-2xl font-extrabold">
                  {selectedVideo.question}
                </h2>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {selectedVideo.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => checkAnswer(option)}
                      className={`rounded-2xl px-5 py-4 text-left text-sm font-bold transition ${
                        selectedAnswer === option
                          ? "bg-[var(--forest-teal)] text-white"
                          : "bg-[#F3EFE3] text-[var(--forest-navy)] hover:bg-[#E9C46A]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div className="mt-5 rounded-2xl bg-[#92A8D1] p-4">
                    <p className="text-sm font-bold text-[var(--forest-navy)]">
                      Feedback
                    </p>

                    <p className="mt-1 text-sm text-[var(--forest-navy)]/75">
                      {feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Pilih Video
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">Daftar Aktivitas</h2>

            <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/70">
              Pilih salah satu video sesuai aspek perkembangan yang ingin
              dilatih.
            </p>

            <div className="mt-5 space-y-3">
              {videos.map((video, index) => (
                <button
                  key={video.title}
                  onClick={() => chooseVideo(index)}
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    selectedIndex === index
                      ? "bg-[var(--forest-teal)] text-white"
                      : "bg-[#F3EFE3] text-[var(--forest-navy)] hover:bg-[#E9C46A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/55 text-2xl">
                      {video.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold opacity-75">
                        {video.category} • {video.duration}
                      </p>

                      <h3 className="font-extrabold">{video.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#F7CAC9] p-4">
              <p className="text-sm font-bold text-[var(--forest-navy)]">
                Catatan Pendamping
              </p>

              <p className="mt-1 text-sm leading-relaxed text-[var(--forest-navy)]/70">
                Video sebaiknya ditonton bersama orang tua. Fokus utama bukan
                durasi menonton, tetapi interaksi setelah anak melihat materi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}