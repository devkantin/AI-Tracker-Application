import { TrendingUp, TrendingDown, DollarSign, Calendar, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { useExpenseStore } from '../store/useExpenseStore'
import { formatCurrency, thisMonthRange } from '../utils/format'
import { CATEGORY_COLORS } from '../utils/categories'
import type { Category } from '../types'

export default function SummaryCards() {
  const expenses = useExpenseStore((s) => s.expenses)

  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const { from, to } = thisMonthRange()
    const monthly = expenses
      .filter((e) => e.date >= from && e.date <= to)
      .reduce((s, e) => s + e.amount, 0)

    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount
      return acc
    }, {})
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

    const last30 = new Date()
    last30.setDate(last30.getDate() - 30)
    const prev30 = new Date()
    prev30.setDate(prev30.getDate() - 60)

    const recent = expenses
      .filter((e) => new Date(e.date) >= last30)
      .reduce((s, e) => s + e.amount, 0)
    const previous = expenses
      .filter((e) => new Date(e.date) >= prev30 && new Date(e.date) < last30)
      .reduce((s, e) => s + e.amount, 0)

    const trend = previous > 0 ? ((recent - previous) / previous) * 100 : 0

    return { total, monthly, topCategory, trend, count: expenses.length }
  }, [expenses])

  const cards = [
    {
      label: 'Total Spent',
      value: formatCurrency(stats.total),
      sub: `${stats.count} expenses`,
      icon: DollarSign,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-200',
    },
    {
      label: 'This Month',
      value: formatCurrency(stats.monthly),
      sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      icon: Calendar,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
    },
    {
      label: 'Top Category',
      value: stats.topCategory ? stats.topCategory[0] : '—',
      sub: stats.topCategory ? formatCurrency(stats.topCategory[1]) : 'No data',
      icon: Tag,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      dot: stats.topCategory
        ? CATEGORY_COLORS[stats.topCategory[0] as Category]
        : undefined,
    },
    {
      label: '30-Day Trend',
      value: stats.trend === 0 ? '—' : `${Math.abs(stats.trend).toFixed(1)}%`,
      sub: stats.trend > 0 ? 'vs previous 30 days' : stats.trend < 0 ? 'vs previous 30 days' : 'No comparison data',
      icon: stats.trend >= 0 ? TrendingUp : TrendingDown,
      color: stats.trend > 0 ? 'text-red-600' : stats.trend < 0 ? 'text-green-600' : 'text-gray-600',
      bg: stats.trend > 0 ? 'bg-red-50' : stats.trend < 0 ? 'bg-green-50' : 'bg-gray-50',
      border: stats.trend > 0 ? 'border-red-200' : stats.trend < 0 ? 'border-green-200' : 'border-gray-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-2xl p-4 flex flex-col gap-3`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`${card.bg} p-1.5 rounded-lg border ${card.border}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {card.dot && (
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: card.dot }}
                />
              )}
              <p className={`text-xl font-bold ${card.color} truncate`}>{card.value}</p>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
