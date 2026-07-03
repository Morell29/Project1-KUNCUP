export default function PageOrnaments() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Glow besar kiri */}
      <div className="animate-breathe absolute -left-28 top-10 h-72 w-72 rounded-full bg-[var(--forest-teal)]/16 blur-3xl" />
      <div className="animate-wander-wide animation-delay-1000 absolute left-6 top-44 h-28 w-28 rounded-full bg-[var(--rainbow-blue)]/35" />
      <div className="animate-float-soft animation-delay-2000 absolute left-10 bottom-24 h-40 w-40 rounded-[2.7rem] bg-[var(--rainbow-pink)]/42" />
      <div className="animate-breathe animation-delay-3000 absolute -left-12 bottom-0 h-60 w-60 rounded-full bg-[var(--forest-yellow)]/22 blur-3xl" />
      <div className="animate-wander-wide animation-delay-4000 absolute left-32 top-[18%] h-8 w-8 rounded-full bg-[var(--rainbow-coral)]" />
      <div className="animate-float-slow animation-delay-5000 absolute left-36 bottom-[12%] h-6 w-6 rounded-full bg-[var(--rainbow-purple)]" />

      {/* Glow tengah kiri */}
      <div className="animate-float-slow animation-delay-1000 absolute left-[8%] top-[55%] h-20 w-20 rounded-full bg-[var(--forest-orange)]/28 blur-xl" />
      <div className="animate-wander-wide animation-delay-3000 absolute left-[12%] top-[68%] h-14 w-14 rounded-[1.4rem] bg-[var(--rainbow-blue)]/28" />

      {/* Glow kanan */}
      <div className="animate-breathe animation-delay-1000 absolute -right-28 top-8 h-80 w-80 rounded-full bg-[var(--forest-orange)]/18 blur-3xl" />
      <div className="animate-float-soft animation-delay-3000 absolute right-10 top-52 h-28 w-28 rounded-[2.8rem] bg-[var(--rainbow-pink)]/45" />
      <div className="animate-wander-wide animation-delay-2000 absolute right-12 bottom-24 h-24 w-24 rounded-full bg-[var(--rainbow-green)]/40" />
      <div className="animate-breathe animation-delay-4000 absolute -right-14 bottom-0 h-64 w-64 rounded-full bg-[var(--forest-sand)]/26 blur-3xl" />
      <div className="animate-float-soft animation-delay-5000 absolute right-20 top-[22%] h-7 w-7 rounded-full bg-[var(--rainbow-green)]" />
      <div className="animate-float-slow animation-delay-2000 absolute right-28 bottom-[12%] h-6 w-6 rounded-full bg-[var(--forest-yellow)]" />

      {/* Ornamen tengah kiri-kanan tambahan */}
      <div className="animate-wander-wide animation-delay-2000 absolute left-[18%] top-[24%] h-12 w-12 rounded-full bg-[var(--forest-sand)]/30 blur-md" />
      <div className="animate-float-soft animation-delay-3000 absolute right-[18%] top-[68%] h-16 w-16 rounded-[1.8rem] bg-[var(--rainbow-coral)]/18" />

      {/* Ring tipis biar lebih ramai */}
      <div className="animate-float-slow animation-delay-1000 absolute left-[5%] top-[30%] h-24 w-24 rounded-full border-2 border-[var(--rainbow-blue)]/25" />
      <div className="animate-float-soft animation-delay-4000 absolute right-[6%] bottom-[20%] h-28 w-28 rounded-full border-2 border-[var(--rainbow-green)]/25" />
    </div>
  );
}