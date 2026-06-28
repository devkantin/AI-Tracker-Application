import { Wallet, Settings } from 'lucide-react'

interface Props {
  onOpenSettings: () => void
  hasApiKey: boolean
}

export default function Header({ onOpenSettings, hasApiKey }: Props) {
  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Expense Tracker AI</h1>
            <p className="text-primary-100 text-xs">Smart spending insights</p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-lg text-sm font-medium"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">
            {hasApiKey ? 'AI Active' : 'Setup AI'}
          </span>
          {hasApiKey && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
        </button>
      </div>
    </header>
  )
}
