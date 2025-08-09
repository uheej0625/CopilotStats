import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, MessageSquare } from 'lucide-react'

interface Props {
  accessType: string
  copilotPlan: string
  chatEnabled: boolean
  canSignupForLimited: boolean
}

export default function AccountInfoGrid({
  accessType,
  copilotPlan,
  chatEnabled,
  canSignupForLimited,
}: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">계정 유형</CardTitle>
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-xs">
            {accessType.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">플랜</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="text-xs">
            {copilotPlan.toUpperCase()}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">채팅 상태</CardTitle>
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge variant={chatEnabled ? 'default' : 'destructive'} className="text-xs">
            {chatEnabled ? '활성화' : '비활성화'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">제한 가입</CardTitle>
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge variant={canSignupForLimited ? 'default' : 'secondary'} className="text-xs">
            {canSignupForLimited ? '가능' : '불가능'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
