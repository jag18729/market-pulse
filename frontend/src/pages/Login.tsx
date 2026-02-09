import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement auth
    console.log(isSignup ? 'signup' : 'login', { email, password })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <span className="font-bold text-2xl">Market Pulse</span>
        </Link>

        <div className="bg-gray-900 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-green-400 hover:underline"
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
