import { TrendingUp, Plus, Bell, Settings } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span className="font-bold text-xl">Market Pulse</span>
          </div>
          <nav className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Watchlist */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Watchlist</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
              <Plus className="w-4 h-4" />
              Add Ticker
            </button>
          </div>
          <div className="grid gap-4">
            <WatchlistItem ticker="NVDA" name="NVIDIA Corp" price={742.5} change={2.1} />
            <WatchlistItem ticker="AMD" name="Advanced Micro Devices" price={183.2} change={0.8} />
            <WatchlistItem ticker="AAPL" name="Apple Inc" price={189.3} change={-0.2} />
            <WatchlistItem ticker="TSLA" name="Tesla Inc" price={201.4} change={-3.1} />
          </div>
        </section>

        {/* Alerts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400">No alerts configured. Add price or volume alerts to get notified.</p>
          </div>
        </section>

        {/* Recent Briefs */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Briefs</h2>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400">Your morning briefs will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

function WatchlistItem({ ticker, name, price, change }: { ticker: string; name: string; price: number; change: number }) {
  const isGain = change >= 0
  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-xl p-4">
      <div>
        <span className="font-bold text-lg">{ticker}</span>
        <span className="text-gray-400 ml-2">{name}</span>
      </div>
      <div className="text-right">
        <div className="font-semibold">${price.toFixed(2)}</div>
        <div className={isGain ? 'text-green-400' : 'text-red-400'}>
          {isGain ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
