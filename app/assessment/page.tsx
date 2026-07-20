"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import PageDecorSimple from "@/components/PageDecorSimple";
import CameraPreview, { type AssessmentTaskId } from "@/components/CameraPreview";
import { addXP, XP_REWARD } from "@/lib/xp";

// ─── Konfigurasi instruksi ────────────────────────────────────────────────────
const TASKS = [
  {
    id: "holdRightEar" as AssessmentTaskId,
    title: "Pegang Telinga Kanan",
    category: "Koordinasi Tubuh",
    color: "#92A8D1",
    icon: "👂",
    desc: "Sentuh telinga kanan dengan tangan kanan dan tahan selama 1,5 detik.",
    hint: "Pastikan wajah dan tangan kanan terlihat jelas di dalam kamera.",
  },
  {
    id: "raiseLeftHand" as AssessmentTaskId,
    title: "Angkat Tangan Kiri",
    category: "Motorik Kasar",
    color: "#F7CAC9",
    icon: "🙋",
    desc: "Angkat tangan kiri melewati tinggi bahu dan tahan selama 1,5 detik.",
    hint: "Pastikan bagian tubuh dari pinggang ke atas terlihat di kamera.",
  },
  {
    id: "closeEyes" as AssessmentTaskId,
    title: "Tutup Mata",
    category: "Respons Instruksi",
    color: "#E9C46A",
    icon: "😌",
    desc: "Tutup kedua mata rapat-rapat dan tahan selama 1,5 detik.",
    hint: "Pastikan wajah menghadap kamera dengan pencahayaan yang cukup terang.",
  },
  {
    id: "countFingers" as AssessmentTaskId,
    title: "Hitung dengan Jari",
    category: "Motorik Halus",
    color: "#88B04B",
    icon: "✋",
    desc: "Tunjukkan angka 1 hingga 10 dengan jari secara berurutan.",
    hint: "Untuk angka 6–10, gunakan kedua tangan. Tahan setiap angka selama 1,5 detik.",
  },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "detecting" | "complete";

type TaskResult = {
  taskId: AssessmentTaskId;
  status: "success" | "skipped";
  fingersDone?: number; // untuk countFingers: berapa angka yang dikonfirmasi
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [phase, setPhase]                     = useState<Phase>("idle");
  const [currentIndex, setCurrentIndex]       = useState(0);
  const [fingerStep, setFingerStep]           = useState(1);        // 1–10
  const [confirmedFingers, setConfirmedFingers] = useState<number[]>([]); // angka yang sudah dikonfirmasi
  const [results, setResults]                 = useState<TaskResult[]>([]);

  const currentTask      = TASKS[currentIndex];
  const isLastTask       = currentIndex === TASKS.length - 1;
  const isCountingFingers = currentTask?.id === "countFingers";

  // ── Pindah ke instruksi berikutnya ──────────────────────────────────────
  const advanceTask = useCallback(
    (result: TaskResult) => {
      setResults((prev) => [...prev, result]);
      if (isLastTask) {
        setPhase("complete");
      } else {
        setCurrentIndex((i) => i + 1);
        setFingerStep(1);
        setConfirmedFingers([]);
        // phase tetap "detecting", CameraPreview reset otomatis saat activeTaskId berubah
      }
    },
    [isLastTask]
  );

  // ── Callback dari CameraPreview saat deteksi terkonfirmasi ──────────────
  const handleDetected = useCallback(() => {
    if (isCountingFingers) {
      const newConfirmed = [...confirmedFingers, fingerStep];
      setConfirmedFingers(newConfirmed);

      if (fingerStep >= 10) {
        // Semua angka 1–10 terkonfirmasi
        addXP("assessment", XP_REWARD.assessment_task, "Assessment: Hitung dengan Jari");
        advanceTask({
          taskId: "countFingers",
          status: "success",
          fingersDone: 10,
        });
      } else {
        // Lanjut ke angka berikutnya (XP saat selesai semua)
        setFingerStep((s) => s + 1);
      }
    } else {
      addXP("assessment", XP_REWARD.assessment_task, `Assessment: ${currentTask.title}`);
      advanceTask({ taskId: currentTask.id, status: "success" });
    }
  }, [isCountingFingers, fingerStep, confirmedFingers, currentTask, advanceTask]);

  // ── Lewati instruksi saat ini ────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    advanceTask({
      taskId: currentTask.id,
      status: "skipped",
      fingersDone: isCountingFingers ? confirmedFingers.length : undefined,
    });
  }, [currentTask, isCountingFingers, confirmedFingers, advanceTask]);

  // ── Mulai sesi dari awal ─────────────────────────────────────────────────
  const handleStart = () => {
    setCurrentIndex(0);
    setFingerStep(1);
    setConfirmedFingers([]);
    setResults([]);
    setPhase("detecting");
  };

  // ── Reset ke idle ────────────────────────────────────────────────────────
  const handleReset = () => {
    setPhase("idle");
    setCurrentIndex(0);
    setFingerStep(1);
    setConfirmedFingers([]);
    setResults([]);
  };

  const isDetecting = phase === "detecting";

  // Progress bar sesi (0–100)
  const sessionPct =
    phase === "complete"
      ? 100
      : phase === "idle"
      ? 0
      : (currentIndex / TASKS.length) * 100;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--kuncup-bg)] px-6 py-6 text-[var(--forest-navy)]">
      <PageDecorSimple />

      <section className="relative z-10 mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--forest-teal)]">AI Assessment</p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
              Latihan Gerak Interaktif
            </h1>
            <p className="mt-1 max-w-3xl text-[var(--forest-navy)]/70">
              Anak mengikuti instruksi sederhana, lalu sistem menilai respons gerak secara
              interaktif melalui kamera.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[var(--forest-teal)] px-5 py-2 text-sm font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white"
          >
            Dashboard
          </Link>
        </div>

        {/* ── Progress Bar Sesi ── */}
        {phase !== "idle" && (
          <div className="mb-5">
            <div className="mb-1 flex items-center justify-between text-sm font-semibold">
              <span>
                {phase === "complete"
                  ? "🎉 Sesi selesai!"
                  : `Instruksi ${currentIndex + 1} dari ${TASKS.length}`}
              </span>
              <span className="text-[var(--forest-teal)]">{Math.round(sessionPct)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[var(--forest-teal)] transition-all duration-700"
                style={{ width: `${sessionPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {/* ═══════════════════════════════════════════════════════════════
              Kolom Kiri: Kamera + Instruksi + Tombol
          ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {/* Kamera */}
            <CameraPreview
              activeTaskId={isDetecting ? currentTask?.id : undefined}
              fingerTarget={fingerStep}
              isDetecting={isDetecting}
              onDetected={handleDetected}
            />

            {/* Banner instruksi aktif */}
            {phase !== "complete" && currentTask && (
              <div
                className="rounded-3xl p-5 text-[var(--forest-navy)]"
                style={{ backgroundColor: currentTask.color }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/55 text-3xl shadow-sm">
                    {currentTask.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                      Instruksi Saat Ini
                    </p>
                    <h2 className="text-2xl font-extrabold">{currentTask.title}</h2>
                    {isCountingFingers && isDetecting && (
                      <p className="mt-0.5 text-sm font-semibold">
                        Tunjukkan{" "}
                        <span className="rounded-full bg-white/60 px-2 py-0.5 font-extrabold">
                          {fingerStep}
                        </span>{" "}
                        jari
                        <span className="ml-2 opacity-60">
                          ({confirmedFingers.length}/10 terkonfirmasi)
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--forest-navy)]/75">
                  {currentTask.desc}
                </p>
                <p className="mt-1 text-xs text-[var(--forest-navy)]/55">{currentTask.hint}</p>
              </div>
            )}

            {/* Progress hitung jari 1–10 */}
            {isCountingFingers && isDetecting && (
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <p className="mb-3 text-sm font-bold">Progress Hitungan Jari (1 – 10)</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                    const done    = confirmedFingers.includes(n);
                    const current = n === fingerStep;
                    return (
                      <div
                        key={n}
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                          done
                            ? "scale-95 bg-green-500 text-white"
                            : current
                            ? "scale-110 bg-[var(--forest-teal)] text-white ring-2 ring-[var(--forest-teal)] ring-offset-2"
                            : "bg-gray-100 text-gray-400",
                        ].join(" ")}
                      >
                        {done ? "✓" : n}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-[var(--forest-navy)]/60">
                  Untuk angka 6–10 gunakan kedua tangan secara bersamaan. Tahan setiap angka
                  1,5 detik hingga ring hijau penuh.
                </p>
              </div>
            )}

            {/* Tombol aksi */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {phase === "idle" && (
                <button
                  id="btn-mulai-sesi"
                  onClick={handleStart}
                  className="rounded-full bg-[var(--forest-teal)] px-7 py-3 font-bold text-white transition hover:bg-[var(--forest-navy)]"
                >
                  Mulai Sesi
                </button>
              )}

              {phase === "detecting" && (
                <button
                  id="btn-lewati"
                  onClick={handleSkip}
                  className="rounded-full border border-[var(--forest-teal)] px-7 py-3 font-bold text-[var(--forest-teal)] transition hover:bg-[var(--forest-teal)] hover:text-white"
                >
                  Lewati Instruksi Ini
                </button>
              )}

              {phase === "complete" && (
                <button
                  id="btn-ulangi"
                  onClick={handleReset}
                  className="rounded-full bg-[var(--forest-teal)] px-7 py-3 font-bold text-white transition hover:bg-[var(--forest-navy)]"
                >
                  Ulangi Sesi
                </button>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              Kolom Kanan: Daftar + Status
          ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4">
            {/* Daftar instruksi */}
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="text-xl font-extrabold">Daftar Instruksi</h2>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Aktivitas yang akan dinilai secara interaktif.
              </p>

              <div className="mt-4 space-y-3">
                {TASKS.map((task, index) => {
                  const result  = results.find((r) => r.taskId === task.id);
                  const isActive = isDetecting && index === currentIndex;

                  const statusIcon = result
                    ? result.status === "success"
                      ? "✅"
                      : "⏩"
                    : isActive
                    ? "🔄"
                    : task.icon;

                  return (
                    <div
                      key={task.id}
                      className={[
                        "rounded-2xl p-4 transition-all duration-300",
                        isActive ? "ring-2 ring-[var(--forest-navy)] shadow-md" : "",
                        result ? "opacity-80" : "",
                      ].join(" ")}
                      style={{ backgroundColor: task.color }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/55 text-xl">
                          {statusIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--forest-navy)]/65">
                            Instruksi {index + 1} · {task.category}
                          </p>
                          <p className="truncate font-extrabold text-[var(--forest-navy)]">
                            {task.title}
                          </p>
                          {/* Progress jari untuk countFingers */}
                          {task.id === "countFingers" && isActive && (
                            <p className="text-xs font-semibold text-[var(--forest-navy)]/70">
                              Angka {fingerStep} dari 10
                            </p>
                          )}
                          {task.id === "countFingers" && result && (
                            <p className="text-xs font-semibold text-[var(--forest-navy)]/70">
                              {result.fingersDone ?? 0} / 10 angka terkonfirmasi
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel status deteksi */}
            <div className="rounded-2xl bg-[var(--forest-sand)] p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-bold text-[var(--forest-navy)]/70">
                Status Deteksi
              </p>

              {phase === "idle" && (
                <>
                  <h3 className="mt-1 font-extrabold">Siap Dimulai</h3>
                  <p className="mt-1 text-sm text-[var(--forest-navy)]/70">
                    Klik "Mulai Sesi" untuk memulai assessment. Pastikan kamera aktif
                    dan anak berada di depan layar.
                  </p>
                </>
              )}

              {phase === "detecting" && (
                <>
                  <h3 className="mt-1 font-extrabold">
                    {isCountingFingers
                      ? `⏳ Menunggu ${fingerStep} jari...`
                      : `⏳ Mendeteksi: ${currentTask?.title}`}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--forest-navy)]/70">
                    Tahan posisi yang benar selama 1,5 detik. Ring hijau di kamera
                    menunjukkan progres konfirmasi.
                  </p>
                </>
              )}

              {phase === "complete" && (
                <>
                  <h3 className="mt-1 font-extrabold">🎉 Sesi Selesai!</h3>
                  <div className="mt-3 space-y-2">
                    {results.map((r) => {
                      const task = TASKS.find((t) => t.id === r.taskId);
                      return (
                        <div
                          key={r.taskId}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="mt-0.5 shrink-0">
                            {r.status === "success" ? "✅" : "⏩"}
                          </span>
                          <div>
                            <span className="font-semibold">{task?.title}</span>
                            {r.taskId === "countFingers" && (
                              <span className="ml-1 text-xs opacity-60">
                                ({r.fingersDone ?? 0}/10 angka)
                              </span>
                            )}
                            {r.status === "skipped" && (
                              <span className="ml-1 text-xs opacity-60">(dilewati)</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Info bawah ── */}
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold text-[var(--forest-teal)]">Fokus Penilaian</p>
              <h3 className="mt-1 text-lg font-extrabold">Pemahaman Instruksi</h3>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Melihat apakah anak mampu memahami dan mengikuti arahan sederhana.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--forest-teal)]">Aspek Gerak</p>
              <h3 className="mt-1 text-lg font-extrabold">Motorik & Koordinasi</h3>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Melatih koordinasi tangan, tubuh, dan respons visual anak.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--forest-teal)]">Catatan Penting</p>
              <h3 className="mt-1 text-lg font-extrabold">Bukan Diagnosis</h3>
              <p className="mt-1 text-sm text-[var(--forest-navy)]/65">
                Hasil hanya digunakan sebagai stimulasi dan pemantauan awal, bukan
                diagnosis medis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}