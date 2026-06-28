import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense, FilterState } from '../types'

interface ExpenseStore {
  expenses: Expense[]
  filters: FilterState
  editingExpense: Expense | null
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  setFilters: (filters: Partial<FilterState>) => void
  setEditingExpense: (expense: Expense | null) => void
  importExpenses: (expenses: Expense[]) => void
}

const defaultFilters: FilterState = {
  search: '',
  category: 'All',
  dateFrom: '',
  dateTo: '',
  sortField: 'date',
  sortOrder: 'desc',
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      filters: defaultFilters,
      editingExpense: null,
      addExpense: (expense) =>
        set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)),
          editingExpense: null,
        })),
      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      setEditingExpense: (expense) => set({ editingExpense: expense }),
      importExpenses: (expenses) =>
        set((state) => ({
          expenses: [
            ...expenses.filter(
              (imp) => !state.expenses.some((e) => e.id === imp.id)
            ),
            ...state.expenses,
          ],
        })),
    }),
    { name: 'expense-tracker-storage' }
  )
)
