"use client";

import Link from "next/link";
import { useState } from "react";
import PageDecorSimple from "@/components/PageDecorSimple";

export default function WorksheetPage() {
  const worksheets = [
    {
      title: "Tracing Garis Lurus",
      category: "Pra-Menulis",
      level: "Mudah",
      description: "Melatih kontrol tangan dan koordinasi mata-tangan.",
      skill: "Motorik Halus",
      icon: "➖",
      bg: "#92A8D1",
      accent: "#264653",
      preview: ["──────", "──────", "──────", "──────"],
    },
    {
      title: "Tracing Garis Lengkung",
      category: "Motorik Halus",
      level: "Sedang",
      description: "Membantu anak mengikuti pola lengkung sederhana.",
      skill: "Koordinasi",
      icon: "〰️",
      bg: "#F7CAC9",
      accent: "#FF6F61",
      preview: ["∿ ∿ ∿ ∿", "∿ ∿ ∿ ∿", "∿ ∿ ∿ ∿", "∿ ∿ ∿ ∿"],
    },
    {
      title: "Pola Zig-Zag",
      category: "Fokus & Koordinasi",
      level: "Sedang",
      description: "Melatih ketelitian anak dalam mengikuti arah garis.",
      skill: "Fokus",
      icon: "⚡",
      bg: "#F9C74F",
      accent: "#F4A261",
      preview: ["/\\/\\/\\", "/\\/\\/\\", "/\\/\\/\\", "/\\/\\/\\"],
    },
    {
      title: "Menghubungkan Titik",
      category: "Kognitif Dasar",
      level: "Mudah",
      description: "Membantu anak mengenal urutan dan bentuk sederhana.",
      skill: "Logika Dasar",
      icon: "🔵",
      bg: "#88B04B",
      accent: "#2A9D8F",
      preview: ["1 •     • 2", "", "4 •     • 3", ""],
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState("");

  const selectedWorksheet = worksheets[selectedIndex];

  function chooseWorksheet(index: number) {
    setSelectedIndex(index);
    setDownloadMessage("");
  }

  function handleDownload() {
    setDownloadMessage(
      `Worksheet "${selectedWorksheet.title}" siap diunduh. File PDF asli akan ditambahkan pada tahap berikutnya.`
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Worksheet
            </p>

            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Lembar Latihan Anak
            </h1>

            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Unduh worksheet untuk melatih kemampuan pra-menulis, fokus,
              koordinasi mata-tangan, dan motorik halus anak.
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
              className="relative overflow-hidden rounded-3xl p-6"
              style={{
                backgroundColor: selectedWorksheet.bg,
                color: "var(--forest-navy)",
              }}
            >
              <div
                className="absolute right-0 top-0 h-32 w-32 rounded-bl-full opacity-80"
                style={{ backgroundColor: selectedWorksheet.accent }}
              />

              <div className="relative z-10 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/55 text-4xl shadow-sm">
                    {selectedWorksheet.icon}
                  </div>

                  <p className="mt-5 text-sm font-bold text-[var(--forest-navy)]/70">
                    {selectedWorksheet.category} • Level{" "}
                    {selectedWorksheet.level}
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold">
                    {selectedWorksheet.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                    {selectedWorksheet.description}
                  </p>

                  <div className="mt-5 inline-flex rounded-full bg-white/55 px-4 py-2 text-sm font-bold shadow-sm">
                    Fokus: {selectedWorksheet.skill}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                  <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                    Preview Worksheet
                  </p>

                  <div className="mt-4 rounded-2xl bg-white p-5">
                    <div className="mb-4 flex items-center justify-between border-b border-dashed border-[var(--forest-navy)]/25 pb-3">
                      <p className="text-sm font-extrabold">Nama: ______</p>
                      <p className="text-sm font-extrabold">Tanggal: ______</p>
                    </div>

                    <div className="space-y-4 text-center font-mono text-2xl font-bold tracking-widest text-[var(--forest-navy)]/70">
                      {selectedWorksheet.preview.map((line, index) => (
                        <p key={index} className="min-h-7">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[var(--forest-navy)]/65">
                    Preview ini hanya gambaran. File asli akan dibuat dalam
                    bentuk PDF agar mudah dicetak.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Tujuan
                </p>
                <h3 className="mt-1 text-lg font-extrabold">
                  Latihan Pra-Menulis
                </h3>
                <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                  Membantu anak terbiasa mengontrol arah garis dan bentuk.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Durasi
                </p>
                <h3 className="mt-1 text-lg font-extrabold">5–10 Menit</h3>
                <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                  Gunakan dalam sesi singkat agar anak tetap nyaman.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Pendamping
                </p>
                <h3 className="mt-1 text-lg font-extrabold">Orang Tua</h3>
                <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                  Dampingi anak saat mencoba, bukan menuntut hasil sempurna.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Pilih Worksheet
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">Daftar Latihan</h2>

            <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/70">
              Pilih worksheet sesuai kemampuan yang ingin dilatih hari ini.
            </p>

            <div className="mt-5 space-y-3">
              {worksheets.map((worksheet, index) => (
                <button
                  key={worksheet.title}
                  onClick={() => chooseWorksheet(index)}
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    selectedIndex === index
                      ? "bg-[var(--forest-teal)] text-white"
                      : "bg-[#F3EFE3] text-[var(--forest-navy)] hover:bg-[#E9C46A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/55 text-2xl">
                      {worksheet.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold opacity-75">
                        {worksheet.category} • {worksheet.level}
                      </p>
                      <h3 className="font-extrabold">{worksheet.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleDownload}
              className="mt-5 w-full rounded-full bg-[var(--forest-teal)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-navy)]"
            >
              Download Worksheet
            </button>

            {downloadMessage && (
              <div className="mt-5 rounded-2xl bg-[#92A8D1] p-4">
                <p className="text-sm font-bold text-[var(--forest-navy)]">
                  Informasi Download
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                  {downloadMessage}
                </p>
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-[#F7CAC9] p-4">
              <p className="text-sm font-bold text-[var(--forest-navy)]">
                Catatan untuk Orang Tua
              </p>

              <p className="mt-1 text-sm leading-relaxed text-[var(--forest-navy)]/70">
                Fokus utama worksheet bukan hasil yang rapi, tetapi proses anak
                dalam mencoba, mengikuti pola, dan mengembangkan koordinasi
                tangan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}