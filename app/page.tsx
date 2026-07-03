import Link from "next/link";
import PageOrnaments from "@/components/PageOrnaments";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] text-[var(--forest-navy)]">
      <PageOrnaments />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl rounded-[2.5rem] bg-white/72 px-8 py-12 text-center shadow-[0_20px_60px_rgba(38,70,83,0.12)] ring-1 ring-white/70 backdrop-blur-md md:px-14 md:py-16">
          <div className="mx-auto mb-5 inline-block rounded-full bg-[var(--forest-sand)]/75 px-5 py-2 text-sm font-semibold text-[var(--forest-navy)] shadow-sm">
            Platform pendamping kesiapan sekolah anak usia 2–5 tahun
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
            KUNCUP
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[var(--forest-navy)]/75 md:text-xl">
            Membantu orang tua menstimulasi, memantau, dan memahami kesiapan anak
            sebelum memasuki pendidikan formal melalui aktivitas interaktif
            berbasis teknologi.
          </p>

          <div className="mt-9">
            <Link
              href="/dashboard"
              className="rounded-full bg-[var(--forest-teal)] px-9 py-3 font-bold text-white shadow-md transition hover:bg-[var(--forest-navy)]"
            >
              Mulai Petualangan!
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[var(--rainbow-coral)]" />
            <div className="h-4 w-4 rounded-full bg-[var(--forest-yellow)]" />
            <div className="h-4 w-4 rounded-full bg-[var(--rainbow-green)]" />
            <div className="h-4 w-4 rounded-full bg-[var(--rainbow-blue)]" />
            <div className="h-4 w-4 rounded-full bg-[var(--rainbow-purple)]" />
          </div>
        </div>
      </section>
    </main>
  );
}