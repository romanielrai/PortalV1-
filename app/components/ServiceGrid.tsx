const services = [
  {
    title: 'AI Receptionist & Appointment Setter',
    description: '24/7 inbound call answering, qualification, booking, and report automation.',
    tags: ['Live within 48 hours', 'Custom scripts', 'Weekly reporting']
  },
  {
    title: 'Missed Call Recovery',
    description: 'Recover callers fast with AI callback, SMS, email, and revenue alerts.',
    tags: ['Text in 10 seconds', 'AI callbacks', 'CRM integration']
  },
  {
    title: 'Dead Lead Reactivation',
    description: 'AI-driven campaigns that revive stale contacts with email, SMS, and scoring.',
    tags: ['Audit + campaign', 'Copywriting', 'Lead scoring']
  }
];

export default function ServiceGrid() {
  return (
    <section id="services" className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Services</p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Premium AI workflows for fast revenue growth.</h2>
        <p className="mx-auto max-w-2xl text-base leading-8 text-foreground/80">
          Enterprise-grade AI services built for sales teams, contact centers, and service-based businesses that demand professional automation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-glow">
            <h3 className="text-xl font-semibold text-white">{service.title}</h3>
            <p className="mt-4 text-foreground/85">{service.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {service.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground/80">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
