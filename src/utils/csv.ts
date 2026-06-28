import type { Expense } from '../types'

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Title', 'Category', 'Amount', 'Notes']
  const rows = expenses.map((e) => [
    e.date,
    `"${e.title.replace(/"/g, '""')}"`,
    e.category,
    e.amount.toFixed(2),
    `"${(e.notes ?? '').replace(/"/g, '""')}"`,
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function parseCSV(text: string): Omit<Expense, 'id'>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const result: Omit<Expense, 'id'>[] = []
  for (const line of lines.slice(1)) {
    const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) ?? []
    const clean = cols.map((c) => c.replace(/^"|"$/g, '').replace(/""/g, '"').trim())
    const amount = parseFloat(clean[3] ?? '0')
    if (isNaN(amount)) continue
    result.push({
      date: clean[0] ?? new Date().toISOString().slice(0, 10),
      title: clean[1] ?? 'Imported Expense',
      category: (clean[2] as Expense['category']) ?? 'Other',
      amount,
      notes: clean[4] ?? '',
    })
  }
  return result
}
