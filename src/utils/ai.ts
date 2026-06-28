import Anthropic from '@anthropic-ai/sdk'
import type { Category } from '../types'
import { CATEGORIES } from './categories'

let client: Anthropic | null = null

function getClient(apiKey: string): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  }
  return client
}

export function resetClient(): void {
  client = null
}

export async function categorizeExpense(
  title: string,
  apiKey: string
): Promise<Category> {
  try {
    const ai = getClient(apiKey)
    const response = await ai.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: `Categorize this expense into exactly one of these categories: ${CATEGORIES.join(', ')}.
Expense: "${title}"
Reply with only the category name, nothing else.`,
        },
      ],
    })
    const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : ''
    return (CATEGORIES.includes(text as Category) ? text : 'Other') as Category
  } catch {
    return 'Other'
  }
}

export interface AIInsight {
  summary: string
  topCategory: string
  savingTip: string
  trend: string
}

export async function getSpendingInsights(
  expenses: { title: string; amount: number; category: string; date: string }[],
  apiKey: string
): Promise<AIInsight> {
  const ai = getClient(apiKey)

  const data = expenses
    .slice(0, 50)
    .map((e) => `${e.date}: ${e.title} (${e.category}) - $${e.amount.toFixed(2)}`)
    .join('\n')

  const response = await ai.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `Analyze these expenses and respond with ONLY a JSON object (no markdown, no explanation):
{
  "summary": "2-sentence overall summary",
  "topCategory": "highest spending category name",
  "savingTip": "one specific actionable saving tip",
  "trend": "brief trend observation"
}

Expenses:
${data}`,
      },
    ],
  })

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '{}'
  try {
    return JSON.parse(text) as AIInsight
  } catch {
    return {
      summary: 'Unable to parse insights.',
      topCategory: 'Unknown',
      savingTip: 'Track your expenses regularly.',
      trend: 'Insufficient data.',
    }
  }
}
