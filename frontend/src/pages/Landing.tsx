import { Link } from 'react-router-dom'
import { TrendingUp, Bell, Zap, MessageCircle } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <TrendingUp className="w-12 h-12 text-green-400" />
          <h1 className="text-5xl font-bold">Market Pulse</h1>
        </div>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Wake up smarter than Wall Street. AI-powered market briefs delivered 
          to Telegram at 6 AM — personalized, fresh, and actionable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition"
          >
            Learn More
          </a>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Market Pulse?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="Fresh Data"
            description="Briefs generated at 5:59 AM with real-time pre-market data — not stale overnight content."
          />
          <FeatureCard
            icon={<Bell className="w-8 h-8 text-blue-400" />}
            title="Smart Alerts"
            description="Price, volume, and news-based alerts for your watchlist. Never miss a move."
          />
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8 text-green-400" />}
            title="Interactive"
            description="Reply to your brief with any ticker. Get instant quotes and analysis."
          />
        </div>
      </section>

      {/* Sample Brief */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Sample Morning Brief</h2>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-gray-300">{`☀️ Good morning — February 8, 2026

📊 PRE-MARKET SNAPSHOT (5:59 AM PST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S&P 500 Futures    +0.34%  │  4,892
Nasdaq Futures     +0.51%  │  17,234
VIX                14.2    │  -0.8

🎯 YOUR WATCHLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NVDA    $742.50  +2.1% pre  │ 🔥 Earnings beat!
AMD     $183.20  +0.8% pre  │ Following NVDA
AAPL    $189.30  -0.2% pre  │ Quiet

🚨 TRIGGERED ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ AMD crossed $180 target

Reply with a ticker for instant quote. 📈`}</pre>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to wake up smarter?</h2>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
        >
          Start Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
        <p>Part of the vandine.us infrastructure</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
