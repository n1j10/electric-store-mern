export function Footer() {
  return (
    <footer className="mt-20 border-t border-outline-variant/50 bg-surface-container-low">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="font-manrope text-lg font-bold">TECH_ARTIFACT</h3>
          <p className="mt-3 text-sm text-on-surface-variant">
            Precision tools for creators, engineers, and operators.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
            <li>Collections</li>
            <li>New Arrivals</li>
            <li>Specials</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Technical</h4>
          <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
            <li>Shipping Policy</li>
            <li>Warranty</li>
            <li>Support</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Stay Calibrated</h4>
          <div className="mt-3 flex gap-2">
            <input
              className="h-10 flex-1 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none focus:border-secondary"
              placeholder="Your email"
            />
            <button className="rounded-xl bg-primary px-4 text-sm font-medium text-white">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-outline-variant/40 py-4 text-center text-xs text-on-surface-variant">
        Copyright {new Date().getFullYear()} TECH_ARTIFACT. All rights reserved.
      </div>
    </footer>
  );
}
