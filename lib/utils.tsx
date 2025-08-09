import { MessageSquare, Zap, BarChart3, Shield } from 'lucide-react'

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getQuotaIcon = (quotaId: string) => {
  switch (quotaId) {
    case 'chat':
      return <MessageSquare className="h-4 w-4" />
    case 'completions':
      return <Zap className="h-4 w-4" />
    case 'premium_interactions':
      return <BarChart3 className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

export const getQuotaColor = (percentRemaining: number) => {
  if (percentRemaining > 70) return 'text-green-600'
  if (percentRemaining > 30) return 'text-yellow-600'
  return 'text-red-600'
}
