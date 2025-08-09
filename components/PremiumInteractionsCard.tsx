import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart3 } from 'lucide-react'
import { Quota } from '../types'

export default function PremiumInteractionsCard({ quota }: { quota: Quota }) {
  if (!quota) return null

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <span className="text-purple-800">Premium Interactions</span>
          <Badge variant="outline" className="text-sm bg-purple-100 text-purple-700 border-purple-300">
            핵심 할당량
          </Badge>
        </CardTitle>
        <CardDescription className="text-base">가장 중요한 프리미엄 상호작용 할당량</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-700">
              {quota.remaining} / {quota.entitlement}
            </div>
            <div className="text-lg text-purple-600">
              {quota.percent_remaining.toFixed(1)}% 남음
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="text-lg font-medium text-gray-700">
              사용량: {quota.entitlement - quota.remaining}
            </div>
            <div className="text-sm text-gray-500">
              초과 허용: {quota.overage_permitted ? '예' : '아니오'}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Progress
            value={quota.percent_remaining}
            className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-purple-600"
          />
        </div>
      </CardContent>
    </Card>
  )
}
