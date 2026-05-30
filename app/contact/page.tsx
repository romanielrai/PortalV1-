export default function ContactPage() {
  return (
    <main className="mx-auto mt-28 max-w-3xl px-6 pb-24 md:px-12">
      <section className="rounded-[32px] border border-white/10 bg-glass p-10 shadow-glow">
        <h1 className="text-4xl font-semibold text-white">Contact Sales</h1>
        <p className="mt-4 text-foreground/80">
          Submit a request and our enterprise AI team will contact you to design a custom automation program.
        </p>
        <div className="mt-8 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#08122f] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Email</p>
            <p className="mt-2 text-white/90">hello@aigrowthsystems.com</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#08122f] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Phone</p>
            <p className="mt-2 text-white/90">+1 (888) 555-0199</p>
          </div>
        </div>
      </section>
    </main>
  );
}
