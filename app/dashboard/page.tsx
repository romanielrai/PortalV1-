export default function DashboardPage() {
  return (
    <main className="mx-auto mt-28 max-w-7xl px-6 pb-24 md:px-12">
      <div className="rounded-[32px] border border-white/10 bg-glass p-10 shadow-glow">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Client Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Revenue, calls, and lead performance.</h1>
          </div>
          <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-3 text-sm text-foreground/80">
            Live updates enabled
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { label: 'Leads Generated', value: '1,872' },
            { label: 'Calls Answered', value: '3,420' },
            { label: 'Appointments Booked', value: '219' }
          ].map((metric) => (
            <div key={metric.label} className="rounded-[28px] border border-white/10 bg-[#08122e] p-6">
              <p className="text-sm text-foreground/80">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-[#08122e] p-6">
            <h2 className="text-xl font-semibold text-white">Campaign Performance</h2>
            <p className="mt-3 text-foreground/80">Engagement, recovered calls, and appointment conversion over the last 30 days.</p>
          </section>
          <section className="rounded-[28px] border border-white/10 bg-[#08122e] p-6">
            <h2 className="text-xl font-semibold text-white">Voice Agent Analytics</h2>
            <ul className="mt-4 space-y-3 text-foreground/80">
              <li>Calls received: 3,420</li>
              <li>Average call duration: 6m 42s</li>
              <li>Conversion rate: 18.7%</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
