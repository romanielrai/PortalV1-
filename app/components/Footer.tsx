export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-7xl border-t border-white/10 pt-10 pb-12 text-sm text-foreground/70">
      <div className="grid gap-4 md:grid-cols-3 md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">AI Growth Systems</p>
          <p className="mt-2 max-w-sm text-foreground/80">
            Premium AI agency infrastructure for enterprise teams, automation, and voice-first engagement.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Product</p>
          <p>Services</p>
          <p>Pricing</p>
          <p>Case Studies</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-white">Company</p>
          <p>Contact</p>
          <p>Privacy</p>
          <p>Terms</p>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-foreground/60">© 2026 AI Growth Systems. Built for enterprise automation and revenue growth.</p>
    </footer>
  );
}
