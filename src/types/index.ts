export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Housing'
  | 'Utilities'
  | 'Travel'
  | 'Education'
  | 'Personal Care'
  | 'Subscriptions'
  | 'Other'

export interface Expense {
  id: string
  title: string
  amount: number
  category: Category
  date: string
  notes?: string
  aiCategorized?: boolean
}

export interface ExpenseFormData {
  title: string
  amount: string
  category: Category
  date: string
  notes: string
}

export type SortField = 'date' | 'amount' | 'title' | 'category'
export type SortOrder = 'asc' | 'desc'

export interface FilterState {
  search: string
  category: Category | 'All'
  dateFrom: string
  dateTo: string
  sortField: SortField
  sortOrder: SortOrder
}
