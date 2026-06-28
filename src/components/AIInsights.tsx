import { useState } from 'react'
import { Sparkles, Loader2, Brain, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useExpenseStore } from '../store/useExpenseStore'
import { getSpendingInsights } from '../utils/ai'
import type { AIInsight } from '../utils/ai'

interface Props {
  apiKey: string
}

export default function AIInsights({ apiKey }: Props) {
  const expenses = useExpenseStore((s) => s.expenses)
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(false)

  if (!apiKey) return null
  if (expenses.length < 3) return null

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await getSpendingInsights(expenses, apiKey)
      setInsight(result)
    } catch (err) {
      toast.error('Failed to generate insights. Check your API key.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-violet-100 p-1.5 rounded-lg">
            <Brain className="w-4 h-4 text-violet-600" />
          </div>
          <h3 className="font-semibold text-violet-800 text-sm">AI Spending Insights</h3>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {loading ? 'Analyzing…' : insight ? 'Refresh' : 'Generate'}
        </button>
      </div>

      {insight ? (
        <div className="space-y-3">
          <div className="bg-white/70 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <BarChart3 className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Summary</span>
            </div>
            <p className="text-sm text-gray-700">{insight.summary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/70 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Top Category</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">{insight.topCategory}</p>
            </div>

            <div className="bg-white/70 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Saving Tip</span>
              </div>
              <p className="text-sm text-gray-700">{insight.savingTip}</p>
            </div>

            <div className="bg-white/70 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Trend</span>
              </div>
              <p className="text-sm text-gray-700">{insight.trend}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-violet-700/70">
          Click "Generate" to get AI-powered analysis of your spending patterns.
        </p>
      )}
    </div>
  )
}
