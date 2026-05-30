const tiers = [
  {
    title: 'Starter',
    price: '$1,497/mo',
    description: 'AI receptionist with appointment booking, scripts, and reports.',
    service: 'AI Receptionist & Appointment Setter'
  },
  {
    title: 'Growth',
    price: '$2,997/mo',
    description: 'Adds follow-up automation, CRM integration, and strategy calls.',
    service: 'Missed Call Recovery'
  },
  {
    title: 'Dominance',
    price: '$5,997/mo',
    description: 'Unlimited contacts, full funnel automation, and brand-trained AI.',
    service: 'Dead Lead Reactivation'
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="rounded-[32px] border border-white/10 bg-glass p-8 shadow-glow">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Plans designed for aggressive enterprise growth.</h2>
          <p className="mt-4 max-w-xl text-foreground/80">
            Pick the right package for your team and scale with AI-powered workflows, voice agents, and automated revenue recovery.
          </p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-[#07102f] p-6">
          <div className="grid gap-4">
            {tiers.map((tier) => (
              <div key={tier.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{tier.title}</h3>
                    <p className="mt-1 text-sm text-foreground/80">{tier.service}</p>
                  </div>
                  <p className="text-xl font-semibold text-gold">{tier.price}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-foreground/80">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
