export default function BookDemoPage() {
  return (
    <main className="mx-auto mt-28 max-w-3xl px-6 pb-24 md:px-12">
      <section className="rounded-[32px] border border-white/10 bg-glass p-10 shadow-glow">
        <h1 className="text-4xl font-semibold text-white">Book a Demo</h1>
        <p className="mt-4 text-foreground/80">
          Schedule a one-on-one consultation to see how AI Growth Systems can transform your intake and revenue operations.
        </p>
        <div className="mt-10 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#08122f] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Consultation Focus</p>
            <p className="mt-2 text-foreground/80">AI Receptionists, missed call recovery, lead reactivation, and appointment setter workflows.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#08122f] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Next Step</p>
            <p className="mt-2 text-foreground/80">We’ll build a custom rollout plan that targets additional booked appointments and recovered revenue.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
