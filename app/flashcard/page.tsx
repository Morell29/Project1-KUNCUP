"use client";

import Link from "next/link";
import { useState } from "react";
import PageDecorSimple from "@/components/PageDecorSimple";
import { addXP, XP_REWARD } from "@/lib/xp";

export default function FlashcardPage() {
  const cards = [
    {
      title: "Kucing",
      category: "Hewan",
      icon: "🐱",
      sound: "Meong",
      bg: "#F7CAC9",
      accent: "#FF6F61",
    },
    {
      title: "Anjing",
      category: "Hewan",
      icon: "🐶",
      sound: "Guk guk",
      bg: "#92A8D1",
      accent: "#264653",
    },
    {
      title: "Sapi",
      category: "Hewan",
      icon: "🐮",
      sound: "Moo",
      bg: "#88B04B",
      accent: "#2A9D8F",
    },
    {
      title: "Ayam",
      category: "Hewan",
      icon: "🐔",
      sound: "Kukuruyuk",
      bg: "#F9C74F",
      accent: "#F4A261",
    },
    {
      title: "Angka 1",
      category: "Angka",
      icon: "1️⃣",
      sound: "Satu",
      bg: "#E9C46A",
      accent: "#F4A261",
    },
    {
      title: "Angka 2",
      category: "Angka",
      icon: "2️⃣",
      sound: "Dua",
      bg: "#6B5B93",
      accent: "#F9C74F",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);

  const currentCard = cards[currentIndex];

  function playSound(text: string) {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "id-ID";
    speech.rate = 0.8;
    speech.pitch = 1.2;

    window.speechSynthesis.speak(speech);
  }

  function playRandomSound() {
    const randomIndex = Math.floor(Math.random() * cards.length);

    setCurrentIndex(randomIndex);
    setSelectedAnswer("");
    setFeedback("");

    setTimeout(() => {
      playSound(cards[randomIndex].sound);
    }, 200);
  }

  function checkAnswer(answer: string) {
    setSelectedAnswer(answer);
    setTotalQuestion((prev) => prev + 1);

    if (answer === currentCard.title) {
      addXP("flashcard", XP_REWARD.flashcard_correct, `Flashcard: ${currentCard.title}`);
      setFeedback(`Benar! Hebat sekali 🎉  +${XP_REWARD.flashcard_correct} XP`);
      setScore((prev) => prev + 1);
    } else {
      addXP("flashcard", XP_REWARD.flashcard_wrong, `Flashcard: ${currentCard.title}`);
      setFeedback(`Belum tepat. Jawabannya adalah ${currentCard.title}.  +${XP_REWARD.flashcard_wrong} XP`);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Flashcard
            </p>

            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Belajar dengan Kartu Interaktif
            </h1>

            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Anak belajar mengenal hewan, angka, suara, dan konsep dasar
              melalui kartu visual serta latihan mendengarkan.
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
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Koleksi Flashcard
                </p>

                <h2 className="text-2xl font-extrabold">
                  Kenali gambar dan suaranya
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="relative overflow-hidden rounded-3xl p-5 shadow-sm"
                  style={{
                    backgroundColor: card.bg,
                    color:
                      card.bg === "#6B5B93"
                        ? "#FFFFFF"
                        : "var(--forest-navy)",
                  }}
                >
                  <div
                    className="absolute right-0 top-0 h-20 w-20 rounded-bl-full opacity-80"
                    style={{ backgroundColor: card.accent }}
                  />

                  <div className="relative z-10 text-center">
                    <p className="text-sm font-bold opacity-80">
                      {card.category}
                    </p>

                    <div className="mt-3 text-6xl">{card.icon}</div>

                    <h3 className="mt-4 text-xl font-extrabold">
                      {card.title}
                    </h3>

                    <p className="mt-1 text-sm opacity-80">
                      Suara: {card.sound}
                    </p>

                    <button
                      onClick={() => playSound(card.sound)}
                      className="mt-4 rounded-full bg-white/70 px-5 py-2 text-sm font-bold text-[var(--forest-navy)] shadow-sm transition hover:bg-white"
                    >
                      🔊 Putar Suara
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Latihan Interaktif
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">Tebak Suara Ini</h2>

            <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/70">
              Putar suara secara acak, lalu minta anak memilih jawaban yang
              sesuai.
            </p>

            <div className="mt-5 rounded-3xl bg-[var(--forest-sand)] p-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/60 text-5xl">
                ❓
              </div>

              <p className="mt-4 text-sm font-bold text-[var(--forest-navy)]/70">
                Dengarkan suara, lalu pilih jawabannya
              </p>

              <button
                onClick={playRandomSound}
                className="mt-4 rounded-full bg-[var(--forest-teal)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-navy)]"
              >
                🔊 Putar Suara Acak
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => checkAnswer(card.title)}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    selectedAnswer === card.title
                      ? "bg-[var(--forest-teal)] text-white"
                      : "bg-[#F3EFE3] text-[var(--forest-navy)] hover:bg-[#E9C46A]"
                  }`}
                >
                  {card.icon} {card.title}
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

            <div className="mt-5 rounded-2xl bg-[#F7CAC9] p-4">
              <p className="text-sm font-bold text-[var(--forest-navy)]">
                Skor Latihan
              </p>

              <h3 className="mt-1 text-xl font-extrabold">
                {score}/{totalQuestion} Benar
              </h3>

              <p className="mt-1 text-sm text-[var(--forest-navy)]/70">
                Skor ini masih bersifat sementara dan belum tersimpan ke
                database.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}