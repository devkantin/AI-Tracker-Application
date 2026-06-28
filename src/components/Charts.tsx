import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts'
import { useExpenseStore } from '../store/useExpenseStore'
import { CATEGORY_COLORS } from '../utils/categories'
import { formatCurrency } from '../utils/format'
import type { Category } from '../types'

export default function Charts() {
  const expenses = useExpenseStore((s) => s.expenses)

  const { pieData, barData, lineData } = useMemo(() => {
    // Pie: by category
    const catMap = new Map<string, number>()
    for (const e of expenses) {
      catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.amount)
    }
    const pieData = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))

    // Bar: top 8 categories
    const barData = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name: name.split(' ')[0], fullName: name, value: Math.round(value * 100) / 100 }))

    // Line: last 6 months spending
    const monthMap = new Map<string, number>()
    for (const e of expenses) {
      const month = e.date.slice(0, 7)
      monthMap.set(month, (monthMap.get(month) ?? 0) + e.amount)
    }
    const lineData = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
        amount: Math.round(amount * 100) / 100,
      }))

    return { pieData, barData, lineData }
  }, [expenses])

  if (expenses.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name as Category] ?? '#94a3b8'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[entry.name as Category] ?? '#94a3b8' }}
              />
              <span className="text-xs text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">Top Categories</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              labelFormatter={(_, payload) => payload[0]?.payload?.fullName ?? ''}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {barData.map((entry) => (
                <Cell
                  key={entry.fullName}
                  fill={CATEGORY_COLORS[entry.fullName as Category] ?? '#94a3b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart */}
      {lineData.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="amount"
                name="Total Spent"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0ea5e9' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
