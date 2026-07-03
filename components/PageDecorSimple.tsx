export default function PageDecorSimple() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Setengah lingkaran kiri atas */}
      <div className="absolute -left-16 top-24 h-36 w-36 rounded-full bg-[var(--rainbow-blue)]/22" />

      {/* Setengah lingkaran kanan atas */}
      <div className="absolute -right-20 top-36 h-44 w-44 rounded-full bg-[var(--rainbow-pink)]/24" />

      {/* Setengah lingkaran kiri bawah */}
      <div className="absolute -left-12 bottom-24 h-32 w-32 rounded-full bg-[var(--forest-yellow)]/22" />

      {/* Setengah lingkaran kanan bawah */}
      <div className="absolute -right-14 bottom-16 h-36 w-36 rounded-full bg-[var(--rainbow-green)]/20" />

      {/* Lengkungan dekoratif kanan tengah */}
      <div className="absolute right-0 top-1/2 h-28 w-14 -translate-y-1/2 rounded-l-full bg-[var(--forest-sand)]/30" />

      {/* Lengkungan dekoratif kiri tengah */}
      <div className="absolute left-0 top-[58%] h-24 w-12 -translate-y-1/2 rounded-r-full bg-[var(--forest-orange)]/24" />

      {/* Pohon kiri bawah - batang menempel ke bawah layar */}
      <div className="absolute bottom-0 left-8">
        <div className="relative h-32 w-24">
          <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full bg-[var(--rainbow-green)]/85" />
          <div className="absolute left-1/2 top-10 h-16 w-16 -translate-x-1/2 rounded-full bg-[var(--forest-teal)]/75" />
          <div className="absolute bottom-0 left-1/2 h-20 w-5 -translate-x-1/2 rounded-t-md bg-[var(--forest-orange)]/80" />
        </div>
      </div>

      {/* Pohon kanan bawah - batang menempel ke bawah layar */}
      <div className="absolute bottom-0 right-10">
        <div className="relative h-28 w-20">
          <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 rounded-full bg-[var(--rainbow-blue)]/80" />
          <div className="absolute left-1/2 top-8 h-14 w-14 -translate-x-1/2 rounded-full bg-[var(--rainbow-purple)]/55" />
          <div className="absolute bottom-0 left-1/2 h-16 w-4 -translate-x-1/2 rounded-t-md bg-[var(--forest-orange)]/80" />
        </div>
      </div>

      {/* Bukit kecil */}
      <div className="absolute bottom-0 left-[16%] h-12 w-28 rounded-t-full bg-[var(--forest-teal)]/12" />
      <div className="absolute bottom-0 right-[18%] h-10 w-24 rounded-t-full bg-[var(--forest-sand)]/18" />

      {/* Dot kecil */}
      <div className="absolute left-28 top-20 h-4 w-4 rounded-full bg-[var(--rainbow-coral)]/85" />
      <div className="absolute right-24 top-24 h-4 w-4 rounded-full bg-[var(--rainbow-green)]/85" />
      <div className="absolute left-20 bottom-40 h-3 w-3 rounded-full bg-[var(--rainbow-purple)]/80" />
      <div className="absolute right-28 bottom-36 h-3 w-3 rounded-full bg-[var(--forest-yellow)]/90" />
    </div>
  );
}