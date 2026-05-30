export default function AdminPage() {
  return (
    <main className="mx-auto mt-28 max-w-7xl px-6 pb-24 md:px-12">
      <section className="rounded-[32px] border border-white/10 bg-glass p-10 shadow-glow">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Admin Panel</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Client, lead, and analytics management.</h1>
          <p className="mt-4 max-w-2xl text-foreground/80">
            Restricted admin access for managing clients, reviewing leads, and monitoring the AI assistant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            'Manage clients',
            'View analytics',
            'Review leads',
            'Approve appointments',
            'Train chatbot knowledge',
            'Adjust AI scripts'
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
