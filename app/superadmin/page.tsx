export default function SuperAdminPage() {
  return (
    <main className="mx-auto mt-28 max-w-7xl px-6 pb-24 md:px-12">
      <section className="rounded-[32px] border border-white/10 bg-glass p-10 shadow-glow">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Super Admin Control Center</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Enterprise system management.</h1>
          <p className="mt-4 max-w-2xl text-foreground/80">
            Full platform controls for user management, billing, AI configuration, logs, and service health.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {[
            'User management',
            'Subscription billing',
            'AI model configuration',
            'Twilio and ElevenLabs settings',
            'Audit logs',
            'System health & monitoring',
            'CRM integration',
            'Conversation logs',
            'Server status'
          ].map((item) => (
            <div key={item} className="rounded-[28px] border border-white/10 bg-[#08122e] p-6 text-foreground/80">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
