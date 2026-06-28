import { useState, useEffect } from 'react'
import { Plus, Sparkles, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useExpenseStore } from '../store/useExpenseStore'
import { CATEGORIES } from '../utils/categories'
import { categorizeExpense } from '../utils/ai'
import { todayISO } from '../utils/format'
import type { ExpenseFormData, Category } from '../types'

interface Props {
  apiKey: string
}

const empty: ExpenseFormData = {
  title: '',
  amount: '',
  category: 'Other',
  date: todayISO(),
  notes: '',
}

export default function ExpenseForm({ apiKey }: Props) {
  const { addExpense, updateExpense, editingExpense, setEditingExpense } = useExpenseStore()
  const [form, setForm] = useState<ExpenseFormData>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({})
  const [categorizing, setCategorizing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
        notes: editingExpense.notes ?? '',
      })
      setIsExpanded(true)
    }
  }, [editingExpense])

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleAICategorize() {
    if (!form.title.trim()) {
      toast.error('Enter an expense title first')
      return
    }
    if (!apiKey) {
      toast.error('Add your Anthropic API key in settings')
      return
    }
    setCategorizing(true)
    try {
      const cat = await categorizeExpense(form.title, apiKey)
      setForm((f) => ({ ...f, category: cat }))
      toast.success(`Categorized as "${cat}"`)
    } catch {
      toast.error('AI categorization failed')
    } finally {
      setCategorizing(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const expense = {
      id: editingExpense?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      category: form.category as Category,
      date: form.date,
      notes: form.notes.trim(),
      aiCategorized: editingExpense?.aiCategorized ?? false,
    }

    if (editingExpense) {
      updateExpense(expense)
      toast.success('Expense updated')
    } else {
      addExpense(expense)
      toast.success('Expense added')
    }

    setForm({ ...empty, date: todayISO() })
    setErrors({})
    if (!editingExpense) setIsExpanded(false)
  }

  function handleCancel() {
    setEditingExpense(null)
    setForm({ ...empty, date: todayISO() })
    setErrors({})
    setIsExpanded(false)
  }

  function set<K extends keyof ExpenseFormData>(key: K, value: ExpenseFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  if (!isExpanded && !editingExpense) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-4 font-semibold transition-all shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Add Expense
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-semibold">
          {editingExpense ? 'Edit Expense' : 'New Expense'}
        </h2>
        <button onClick={handleCancel} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Lunch at Chipotle"
                className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
              />
              {apiKey && (
                <button
                  type="button"
                  onClick={handleAICategorize}
                  disabled={categorizing}
                  title="Auto-categorize with AI"
                  className="flex items-center gap-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {categorizing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  AI
                </button>
              )}
            </div>
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0.00"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.amount ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.date ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as Category)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Optional note"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors shadow-sm"
          >
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}
