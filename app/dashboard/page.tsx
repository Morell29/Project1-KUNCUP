import Link from "next/link";
import PageDecorSimple from "@/components/PageDecorSimple";

export default function DashboardPage() {
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

  const stats = [
    {
      label: "Progress Hari Ini",
      value: "3/5 Aktivitas",
      detail: "Sebagian aktivitas harian selesai",
      icon: "✅",
      bg: "#88B04B",
    },
    {
      label: "Batas Penggunaan",
      value: "12 Menit",
      detail: "Sisa waktu belajar hari ini",
      icon: "⏳",
      bg: "#E9C46A",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              Dashboard Orang Tua
            </p>

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

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2A9D8F]/15 text-2xl">
                🌱
              </div>

              <div>
                <p className="text-sm text-[var(--forest-navy)]/65">
                  Profil Anak
                </p>
                <h2 className="text-xl font-extrabold">Aira</h2>
                <p className="text-sm text-[var(--forest-navy)]/65">
                  Usia 4 tahun
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-[#2A9D8F]/10 px-3 py-2">
              <p className="text-sm font-bold text-[var(--forest-teal)]">
                Level: Kuncup Ceria
              </p>
            </div>
          </div>

          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: item.bg }}
              >
                {item.icon}
              </div>

              <div>
                <p className="text-sm text-[var(--forest-navy)]/65">
                  {item.label}
                </p>
                <h2 className="text-xl font-extrabold">{item.value}</h2>
                <p className="text-sm text-[var(--forest-navy)]/65">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}

          <Link
            href="/report"
            className="rounded-2xl bg-[var(--forest-teal)] p-4 text-white shadow-sm transition hover:-translate-y-1 hover:bg-[var(--forest-navy)] hover:shadow-md"
          >
            <p className="text-sm text-white/80">Ringkasan Report</p>
            <h2 className="mt-1 text-xl font-extrabold">Kesiapan 79%</h2>
            <p className="mt-1 text-sm text-white/80">
              Motorik dan pendengaran berkembang baik.
            </p>
            <p className="mt-3 text-sm font-bold">Lihat Detail →</p>
          </Link>
        </div>

        <div className="mt-5 rounded-2xl bg-[var(--forest-sand)] p-5 shadow-sm">
          <p className="text-sm font-bold text-[var(--forest-navy)]/70">
            Rekomendasi Hari Ini
          </p>

          <h2 className="mt-1 text-xl font-extrabold">
            Latihan mengenal anggota tubuh
          </h2>

          <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--forest-navy)]/75">
            Ajak anak mengikuti instruksi sederhana seperti menunjuk hidung,
            memegang telinga, dan mengangkat tangan untuk melatih pemahaman
            instruksi serta koordinasi gerak.
          </p>
        </div>

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
              className="relative overflow-hidden rounded-2xl p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md"
              style={{
                backgroundColor: feature.bg,
                color: feature.text,
              }}
            >
              <div
                className="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-80"
                style={{ backgroundColor: feature.accent }}
              />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/55 text-3xl shadow-sm">
                  {feature.icon}
                </div>

                <h3 className="mt-4 text-lg font-extrabold">
                  {feature.title}
                </h3>

                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: feature.muted }}
                >
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