import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { useExpenseStore } from '../store/useExpenseStore'
import { exportToCSV, parseCSV } from '../utils/csv'

export default function ExportImport() {
  const { expenses, importExpenses } = useExpenseStore()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    if (expenses.length === 0) {
      toast.error('No expenses to export')
      return
    }
    exportToCSV(expenses)
    toast.success(`Exported ${expenses.length} expenses`)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        toast.error('No valid expenses found in file')
        return
      }
      const withIds = parsed.map((p) => ({ ...p, id: crypto.randomUUID() }))
      importExpenses(withIds)
      toast.success(`Imported ${withIds.length} expenses`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Import CSV</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  )
}
