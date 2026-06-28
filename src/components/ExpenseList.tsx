import { useMemo } from 'react'
import { Pencil, Trash2, Sparkles, Receipt } from 'lucide-react'
import toast from 'react-hot-toast'
import { useExpenseStore } from '../store/useExpenseStore'
import { formatCurrency, formatDate } from '../utils/format'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories'
import type { Category, Expense } from '../types'

export default function ExpenseList() {
  const { expenses, filters, deleteExpense, setEditingExpense } = useExpenseStore()

  const filtered = useMemo(() => {
    let list = [...expenses]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          (e.notes ?? '').toLowerCase().includes(q)
      )
    }

    if (filters.category !== 'All') {
      list = list.filter((e) => e.category === filters.category)
    }

    if (filters.dateFrom) list = list.filter((e) => e.date >= filters.dateFrom)
    if (filters.dateTo) list = list.filter((e) => e.date <= filters.dateTo)

    list.sort((a, b) => {
      let cmp = 0
      if (filters.sortField === 'date') cmp = a.date.localeCompare(b.date)
      else if (filters.sortField === 'amount') cmp = a.amount - b.amount
      else if (filters.sortField === 'title') cmp = a.title.localeCompare(b.title)
      else if (filters.sortField === 'category') cmp = a.category.localeCompare(b.category)
      return filters.sortOrder === 'asc' ? cmp : -cmp
    })

    return list
  }, [expenses, filters])

  function handleDelete(e: Expense) {
    if (window.confirm(`Delete "${e.title}"?`)) {
      deleteExpense(e.id)
      toast.success('Expense deleted')
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full">
          <Receipt className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-700">No expenses yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first expense above to get started.</p>
        </div>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <p className="font-medium text-gray-600">No expenses match your filters.</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
      </div>
    )
  }

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-medium text-gray-600">
          {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {formatCurrency(total)}
        </span>
      </div>

      <ul className="divide-y divide-gray-50">
        {filtered.map((expense) => {
          const color = CATEGORY_COLORS[expense.category as Category] ?? '#94a3b8'
          const icon = CATEGORY_ICONS[expense.category as Category] ?? '📦'
          return (
            <li
              key={expense.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-gray-800 truncate text-sm">{expense.title}</p>
                  {expense.aiCategorized && (
                    <Sparkles className="w-3 h-3 text-violet-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                  {expense.notes && (
                    <span className="text-xs text-gray-400 truncate hidden sm:block">· {expense.notes}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-semibold text-gray-800 text-sm">
                  {formatCurrency(expense.amount)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
