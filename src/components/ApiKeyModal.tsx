import { useState } from 'react'
import { X, Key, ExternalLink } from 'lucide-react'
import { resetClient } from '../utils/ai'

interface Props {
  apiKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export default function ApiKeyModal({ apiKey, onSave, onClose }: Props) {
  const [value, setValue] = useState(apiKey)

  function handleSave() {
    resetClient()
    onSave(value.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold">AI Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">Enable AI Features</p>
            <p>Add your Anthropic API key to unlock automatic expense categorization and spending insights.</p>
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2"
            >
              Get API key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Stored locally in your browser. Never sent to any server other than Anthropic.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            {apiKey && (
              <button
                onClick={() => { onSave(''); onClose() }}
                className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                Remove Key
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
