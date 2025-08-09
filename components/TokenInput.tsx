import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Key, RefreshCw, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { KeyboardEvent } from 'react'

interface TokenInputProps {
  token: string
  loading: boolean
  saveToken: boolean
  error: string
  onTokenChange: (value: string) => void
  onSaveTokenChange: (checked: boolean) => void
  onFetch: () => void
  onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void
}

export default function TokenInput({
  token,
  loading,
  saveToken,
  error,
  onTokenChange,
  onSaveTokenChange,
  onFetch,
  onKeyPress,
}: TokenInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API 토큰 입력
        </CardTitle>
        <CardDescription>GitHub Copilot API 토큰을 입력하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="API 토큰을 입력하세요..."
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            onKeyPress={onKeyPress}
            className="flex-1"
          />
          <Button onClick={onFetch} disabled={loading || !token.trim()} className="min-w-[120px]">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                로딩중...
              </>
            ) : (
              '데이터 가져오기'
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="save-token" checked={saveToken} onCheckedChange={onSaveTokenChange} />
          <Label htmlFor="save-token" className="text-sm text-gray-600">
            브라우저에 토큰 저장하기 (새로고침 시 자동 로드)
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
