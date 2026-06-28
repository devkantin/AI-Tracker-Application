import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Utilities',
  'Travel',
  'Education',
  'Personal Care',
  'Subscriptions',
  'Other',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#f97316',
  Transportation: '#3b82f6',
  Shopping: '#a855f7',
  Entertainment: '#ec4899',
  Healthcare: '#22c55e',
  Housing: '#14b8a6',
  Utilities: '#eab308',
  Travel: '#06b6d4',
  Education: '#6366f1',
  'Personal Care': '#f43f5e',
  Subscriptions: '#8b5cf6',
  Other: '#94a3b8',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food & Dining': '🍽️',
  Transportation: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Healthcare: '🏥',
  Housing: '🏠',
  Utilities: '⚡',
  Travel: '✈️',
  Education: '📚',
  'Personal Care': '💅',
  Subscriptions: '📱',
  Other: '📦',
}
