import { Card, CardContent } from '@/components/ui/card'
import { Key } from 'lucide-react'

export default function NoDataCard() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Key className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">API 토큰을 입력하세요</h3>
        <p className="text-gray-500">
          할당량 정보를 확인하려면 위에서 API 토큰을 입력하고 "데이터 가져오기" 버튼을 클릭하세요.
        </p>
      </CardContent>
    </Card>
  )
}
