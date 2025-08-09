import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import { formatDate } from '../lib/utils'

export default function DateCards({ assignedDate, quotaResetDate }: { assignedDate: string; quotaResetDate: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">할당 날짜</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">{formatDate(assignedDate)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">할당량 리셋 날짜</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {new Date(quotaResetDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
