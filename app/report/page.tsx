import Link from "next/link";
import PageDecorSimple from "@/components/PageDecorSimple";

export default function ReportPage() {
  const scores = [
    {
      label: "Motorik",
      value: 80,
      description: "Kemampuan mengikuti gerakan tubuh sederhana.",
      color: "#92A8D1",
      icon: "🏃",
    },
    {
      label: "Bahasa",
      value: 72,
      description: "Kemampuan mengenal kata dan menirukan bunyi.",
      color: "#F7CAC9",
      icon: "🗣️",
    },
    {
      label: "Pendengaran",
      value: 85,
      description: "Kemampuan merespons suara dan instruksi.",
      color: "#88B04B",
      icon: "👂",
    },
    {
      label: "Instruksi",
      value: 78,
      description: "Kemampuan mengikuti arahan sederhana.",
      color: "#F9C74F",
      icon: "✅",
    },
  ];

  const activities = [
    {
      title: "Flashcard suara hewan",
      category: "Pendengaran",
      result: "Selesai",
    },
    {
      title: "Instruksi pegang telinga",
      category: "Motorik",
      result: "Selesai",
    },
    {
      title: "Video mengenal angka",
      category: "Kognitif",
      result: "Selesai",
    },
    {
      title: "Worksheet tracing garis lurus",
      category: "Motorik Halus",
      result: "Selesai",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Report Perkembangan
            </p>

            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Analisis Kesiapan Sekolah
            </h1>

            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Ringkasan aktivitas dan capaian anak berdasarkan indikator
              perkembangan awal.
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
            <div className="rounded-3xl bg-[var(--forest-teal)] p-6 text-white">
              <p className="text-sm font-bold text-white/80">
                Ringkasan Kesiapan
              </p>

              <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <h2 className="text-5xl font-extrabold">79%</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                    Aira menunjukkan perkembangan yang baik pada aspek
                    pendengaran dan motorik. Latihan tambahan dapat difokuskan
                    pada pemahaman instruksi dan bahasa sederhana.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 px-5 py-4">
                  <p className="text-sm font-bold text-white/80">
                    Status Hari Ini
                  </p>
                  <p className="mt-1 text-xl font-extrabold">
                    Berkembang Baik
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {scores.map((score) => (
                <div
                  key={score.label}
                  className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                      style={{ backgroundColor: score.color }}
                    >
                      {score.icon}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--forest-teal)]">
                        {score.label}
                      </p>

                      <h2 className="text-3xl font-extrabold">
                        {score.value}%
                      </h2>
                    </div>
                  </div>

                  <div className="mt-4 h-3 rounded-full bg-[#F3EFE3]">
                    <div
                      className="h-3 rounded-full bg-[var(--forest-teal)]"
                      style={{ width: `${score.value}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--forest-navy)]/70">
                    {score.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Profil Anak
            </p>

            <div className="mt-3 rounded-3xl bg-[#F7CAC9] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/60 text-4xl">
                  🌱
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold">Aira</h2>
                  <p className="text-sm font-semibold text-[var(--forest-navy)]/70">
                    Usia 4 tahun
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3">
                <p className="text-sm font-bold text-[var(--forest-teal)]">
                  Level: Kuncup Ceria
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--forest-sand)] p-4">
              <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                Rekomendasi AI
              </p>

              <h3 className="mt-1 text-xl font-extrabold">
                Perbanyak latihan instruksi tubuh
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                Anak dapat dilatih dengan aktivitas menunjuk hidung, memegang
                telinga, mengangkat tangan, dan mengikuti arahan sederhana
                selama 5–10 menit.
              </p>
            </div>

            <button className="mt-5 w-full rounded-full bg-[var(--forest-teal)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-navy)]">
              Buat Rencana Latihan
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold">Aktivitas Terakhir</h2>

            <p className="mt-1 text-sm text-[var(--forest-navy)]/70">
              Riwayat aktivitas yang sudah diselesaikan anak hari ini.
            </p>

            <div className="mt-5 space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={activity.title}
                  className="flex items-center justify-between rounded-2xl bg-[#F3EFE3] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest-teal)] text-sm font-extrabold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-extrabold">{activity.title}</p>
                      <p className="text-sm text-[var(--forest-navy)]/65">
                        {activity.category}
                      </p>
                    </div>
                  </div>

                  <p className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--forest-teal)]">
                    {activity.result}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold">Catatan Pendamping</h2>

            <p className="mt-1 text-sm text-[var(--forest-navy)]/70">
              Ringkasan ini ditujukan untuk membantu orang tua memahami arah
              stimulasi berikutnya.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#92A8D1] p-4">
                <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                  Kekuatan Anak
                </p>
                <h3 className="mt-1 font-extrabold">
                  Respons suara dan gerakan cukup baik
                </h3>
              </div>

              <div className="rounded-2xl bg-[#F7CAC9] p-4">
                <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                  Area yang Perlu Dilatih
                </p>
                <h3 className="mt-1 font-extrabold">
                  Bahasa sederhana dan pemahaman instruksi
                </h3>
              </div>

              <div className="rounded-2xl bg-[#88B04B] p-4 text-[var(--forest-navy)]">
                <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                  Saran Aktivitas
                </p>
                <h3 className="mt-1 font-extrabold">
                  Gunakan flashcard dan AI Assessment secara bergantian
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}