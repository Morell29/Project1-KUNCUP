import Link from "next/link";
import PageDecorSimple from "@/components/PageDecorSimple";
import CameraPreview from "@/components/CameraPreview";

export default function AssessmentPage() {
  const instructions = [
    {
      title: "Pegang telinga kanan",
      category: "Koordinasi Tubuh",
      color: "#92A8D1",
      icon: "👂",
    },
    {
      title: "Angkat tangan kiri",
      category: "Motorik Kasar",
      color: "#F7CAC9",
      icon: "🙋",
    },
    {
      title: "Tutup mata",
      category: "Respons Instruksi",
      color: "#E9C46A",
      icon: "😌",
    },
    {
      title: "Hitung dengan jari",
      category: "Motorik Halus",
      color: "#88B04B",
      icon: "✋",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">
              AI Assessment
            </p>

            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Latihan Gerak Interaktif
            </h1>

            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Anak mengikuti instruksi sederhana, lalu sistem membantu menilai
              respons gerak secara interaktif melalui kamera.
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
            <CameraPreview />

            <div className="mt-5 rounded-3xl bg-[#92A8D1] p-5 text-[var(--forest-navy)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/55 text-3xl shadow-sm">
                  👂
                </div>

                <div>
                  <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                    Instruksi Saat Ini
                  </p>

                  <h2 className="text-2xl font-extrabold">
                    Pegang telinga kanan
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                Pastikan anak berada di depan kamera dan orang tua tetap
                mendampingi selama sesi berlangsung.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-[var(--forest-teal)] px-6 py-3 font-bold text-white transition hover:bg-[var(--forest-navy)]">
                Mulai Sesi
              </button>

              <button className="rounded-full border border-[var(--forest-teal)] px-6 py-3 font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white">
                Ganti Instruksi
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-extrabold">Daftar Instruksi</h2>

            <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
              Aktivitas awal yang akan digunakan untuk mendeteksi respons anak.
            </p>

            <div className="mt-4 space-y-3">
              {instructions.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-4 shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/55 text-2xl">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[var(--forest-navy)]/65">
                        Instruksi {index + 1} • {item.category}
                      </p>

                      <p className="font-extrabold text-[var(--forest-navy)]">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--forest-sand)] p-4">
              <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                Status Deteksi
              </p>

              <h3 className="mt-1 font-extrabold">Menunggu gerakan anak...</h3>

              <p className="mt-1 text-sm text-[var(--forest-navy)]/70">
                Sistem akan menampilkan hasil setelah kamera aktif.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold text-[var(--forest-teal)]">
                Fokus Penilaian
              </p>
              <h3 className="mt-1 text-lg font-extrabold">
                Pemahaman Instruksi
              </h3>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Melihat apakah anak mampu memahami arahan sederhana.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-[var(--forest-teal)]">
                Aspek Gerak
              </p>
              <h3 className="mt-1 text-lg font-extrabold">
                Motorik & Koordinasi
              </h3>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Melatih koordinasi tangan, tubuh, dan respons visual.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-[var(--forest-teal)]">
                Catatan Penting
              </p>
              <h3 className="mt-1 text-lg font-extrabold">Bukan Diagnosis</h3>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Hasil hanya digunakan sebagai stimulasi dan pemantauan awal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}