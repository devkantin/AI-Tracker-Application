import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import ExpenseForm from './components/ExpenseForm'
import FilterBar from './components/FilterBar'
import ExpenseList from './components/ExpenseList'
import Charts from './components/Charts'
import AIInsights from './components/AIInsights'
import ApiKeyModal from './components/ApiKeyModal'
import ExportImport from './components/ExportImport'

const STORAGE_KEY = 'expense-tracker-api-key'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '')
  const [showSettings, setShowSettings] = useState(false)

  function handleSaveKey(key: string) {
    setApiKey(key)
    if (key) localStorage.setItem(STORAGE_KEY, key)
    else localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenSettings={() => setShowSettings(true)} hasApiKey={!!apiKey} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary */}
        <SummaryCards />

        {/* AI Insights */}
        <AIInsights apiKey={apiKey} />

        {/* Charts */}
        <Charts />

        {/* Add/Edit form */}
        <ExpenseForm apiKey={apiKey} />

        {/* Filters + Actions */}
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <FilterBar />
          </div>
          <ExportImport />
        </div>

        {/* Expense list */}
        <ExpenseList />
      </main>

      {showSettings && (
        <ApiKeyModal
          apiKey={apiKey}
          onSave={handleSaveKey}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { fontSize: 14, borderRadius: 10 },
          success: { duration: 2500 },
          error: { duration: 4000 },
        }}
      />
    </div>
  )
}
