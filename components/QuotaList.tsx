import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield } from 'lucide-react'
import { getQuotaIcon, getQuotaColor } from '../lib/utils'
import { Quota } from '../types'

export default function QuotaList({ quotas }: { quotas: Record<string, Quota> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          기타 할당량
        </CardTitle>
        <CardDescription>추가 서비스별 사용량</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(quotas)
          .filter(([key]) => key !== 'premium_interactions')
          .map(([key, quota]) => (
            <div key={key} className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getQuotaIcon(quota.quota_id)}
                  <span className="font-medium capitalize text-sm">
                    {quota.quota_id.replace('_', ' ')}
                  </span>
                  {quota.unlimited && (
                    <Badge variant="outline" className="text-xs">
                      무제한
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  {quota.unlimited ? (
                    <span className="text-sm text-green-600 font-medium">무제한</span>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        <span className={getQuotaColor(quota.percent_remaining)}>
                          {quota.remaining} / {quota.entitlement}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{quota.percent_remaining.toFixed(1)}% 남음</div>
                    </div>
                  )}
                </div>
              </div>

              {!quota.unlimited && (
                <div className="space-y-1">
                  <Progress value={quota.percent_remaining} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>사용량: {quota.entitlement - quota.remaining}</span>
                    <span className="hidden sm:inline">초과 허용: {quota.overage_permitted ? '예' : '아니오'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
