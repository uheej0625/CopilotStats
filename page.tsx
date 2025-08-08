"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Users, MessageSquare, Zap, BarChart3, Shield, Key, RefreshCw, AlertCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ApiDashboard() {
  const [token, setToken] = useState("")
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saveToken, setSaveToken] = useState(false)

  // 컴포넌트 마운트 시 저장된 토큰 불러오기
  useEffect(() => {
    const savedToken = localStorage.getItem('copilot-api-token')
    const shouldSave = localStorage.getItem('save-copilot-token') === 'true'
    
    if (savedToken && shouldSave) {
      setToken(savedToken)
      setSaveToken(true)
      // 저장된 토큰이 있으면 자동으로 데이터 가져오기
      fetchApiDataWithToken(savedToken)
    }
  }, [])

  // 토큰 저장 토글 변경 시
  const handleSaveTokenChange = (checked: boolean) => {
    setSaveToken(checked)
    localStorage.setItem('save-copilot-token', checked.toString())
    
    if (checked && token) {
      // 토글을 켜면 현재 토큰 저장
      localStorage.setItem('copilot-api-token', token)
    } else if (!checked) {
      // 토글을 끄면 저장된 토큰 삭제
      localStorage.removeItem('copilot-api-token')
    }
  }

  // 토큰 입력 시 저장 처리
  const handleTokenChange = (value: string) => {
    setToken(value)
    if (saveToken) {
      localStorage.setItem('copilot-api-token', value)
    }
  }

  // 토큰으로 API 데이터 가져오기 (내부 함수)
  const fetchApiDataWithToken = async (tokenToUse: string) => {
    if (!tokenToUse.trim()) {
      setError("토큰을 입력해주세요.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // GitHub Copilot API 호출
      const response = await fetch("https://api.github.com/copilot_internal/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("유효하지 않은 토큰입니다. 토큰을 확인해주세요.")
        } else if (response.status === 403) {
          throw new Error("접근 권한이 없습니다. Copilot 구독을 확인해주세요.")
        } else {
          throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      setApiData(data)
      setLoading(false)
    } catch (err) {
      console.error("API 호출 에러:", err)
      setError(err.message || "데이터를 가져오는데 실패했습니다.")
      setLoading(false)
    }
  }

  // 토큰으로 API 데이터 가져오기 (외부 호출용)
  const fetchApiData = () => {
    fetchApiDataWithToken(token)
  }

  // 엔터키로 검색
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchApiData()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getQuotaIcon = (quotaId: string) => {
    switch (quotaId) {
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      case "completions":
        return <Zap className="h-4 w-4" />
      case "premium_interactions":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getQuotaColor = (percentRemaining: number) => {
    if (percentRemaining > 70) return "text-green-600"
    if (percentRemaining > 30) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">API 사용량 대시보드</h1>
          <p className="text-sm sm:text-base text-gray-600">현재 계정의 할당량 및 사용 현황</p>
        </div>

        {/* Token Input Section */}
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
                onChange={(e) => handleTokenChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={fetchApiData} disabled={loading || !token.trim()} className="min-w-[120px]">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    로딩중...
                  </>
                ) : (
                  "데이터 가져오기"
                )}
              </Button>
            </div>

            {/* 토큰 저장 토글 */}
            <div className="flex items-center space-x-2">
              <Switch
                id="save-token"
                checked={saveToken}
                onCheckedChange={handleSaveTokenChange}
              />
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

        {/* 데이터가 있을 때만 나머지 섹션들 표시 */}
        {apiData && (
          <>
            {/* Premium Interactions - 가장 중요한 정보를 별도로 강조 */}
            {apiData.quota_snapshots.premium_interactions && (
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
                        {apiData.quota_snapshots.premium_interactions.remaining} / {apiData.quota_snapshots.premium_interactions.entitlement}
                      </div>
                      <div className="text-lg text-purple-600">
                        {apiData.quota_snapshots.premium_interactions.percent_remaining.toFixed(1)}% 남음
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-lg font-medium text-gray-700">
                        사용량: {apiData.quota_snapshots.premium_interactions.entitlement - apiData.quota_snapshots.premium_interactions.remaining}
                      </div>
                      <div className="text-sm text-gray-500">
                        초과 허용: {apiData.quota_snapshots.premium_interactions.overage_permitted ? "예" : "아니오"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress
                      value={apiData.quota_snapshots.premium_interactions.percent_remaining}
                      className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-purple-600"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 기타 할당량 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  기타 할당량
                </CardTitle>
                <CardDescription>추가 서비스별 사용량</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(apiData.quota_snapshots)
                  .filter(([key]) => key !== 'premium_interactions')
                  .map(([key, quota]) => (
                  <div key={key} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getQuotaIcon(quota.quota_id)}
                        <span className="font-medium capitalize text-sm">
                          {quota.quota_id.replace("_", " ")}
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
                          <span className="hidden sm:inline">
                            초과 허용: {quota.overage_permitted ? "예" : "아니오"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">할당 날짜</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{formatDate(apiData.assigned_date)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">할당량 리셋 날짜</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    {new Date(apiData.quota_reset_date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Info - 모바일에서 2x2 그리드로 변경 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">계정 유형</CardTitle>
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    {apiData.access_type_sku.replace("_", " ").toUpperCase()}
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
                    {apiData.copilot_plan.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">채팅 상태</CardTitle>
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant={apiData.chat_enabled ? "default" : "destructive"} className="text-xs">
                    {apiData.chat_enabled ? "활성화" : "비활성화"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">제한 가입</CardTitle>
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant={apiData.can_signup_for_limited ? "default" : "secondary"} className="text-xs">
                    {apiData.can_signup_for_limited ? "가능" : "불가능"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Analytics ID */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">분석 추적 ID</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                  {apiData.analytics_tracking_id}
                </code>
              </CardContent>
            </Card>
          </>
        )}

        {/* 데이터가 없을 때 안내 메시지 */}
        {!apiData && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Key className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">API 토큰을 입력하세요</h3>
              <p className="text-gray-500">
                할당량 정보를 확인하려면 위에서 API 토큰을 입력하고 "데이터 가져오기" 버튼을 클릭하세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
