import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsIdCard({ id }: { id: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">분석 추적 ID</CardTitle>
      </CardHeader>
      <CardContent>
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">{id}</code>
      </CardContent>
    </Card>
  )
}
