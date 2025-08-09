"use client"

import { useState, useEffect, KeyboardEvent } from 'react'
import TokenInput from './TokenInput'
import PremiumInteractionsCard from './PremiumInteractionsCard'
import QuotaList from './QuotaList'
import DateCards from './DateCards'
import AccountInfoGrid from './AccountInfoGrid'
import AnalyticsIdCard from './AnalyticsIdCard'
import NoDataCard from './NoDataCard'
import { ApiData } from '../types'

export default function ApiDashboard() {
  const [token, setToken] = useState('')
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveToken, setSaveToken] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('copilot-api-token')
    const shouldSave = localStorage.getItem('save-copilot-token') === 'true'
    if (savedToken && shouldSave) {
      setToken(savedToken)
      setSaveToken(true)
      fetchApiDataWithToken(savedToken)
    }
  }, [])

  const handleSaveTokenChange = (checked: boolean) => {
    setSaveToken(checked)
    localStorage.setItem('save-copilot-token', checked.toString())
    if (checked && token) {
      localStorage.setItem('copilot-api-token', token)
    } else if (!checked) {
      localStorage.removeItem('copilot-api-token')
    }
  }

  const handleTokenChange = (value: string) => {
    setToken(value)
    if (saveToken) {
      localStorage.setItem('copilot-api-token', value)
    }
  }

  const fetchApiDataWithToken = async (tokenToUse: string) => {
    if (!tokenToUse.trim()) {
      setError('토큰을 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://api.github.com/copilot_internal/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('유효하지 않은 토큰입니다. 토큰을 확인해주세요.')
        } else if (response.status === 403) {
          throw new Error('접근 권한이 없습니다. Copilot 구독을 확인해주세요.')
        } else {
          throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`)
        }
      }
      const data = await response.json()
      setApiData(data)
      setLoading(false)
    } catch (err: any) {
      console.error('API 호출 에러:', err)
      setError(err.message || '데이터를 가져오는데 실패했습니다.')
      setLoading(false)
    }
  }

  const fetchApiData = () => {
    fetchApiDataWithToken(token)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchApiData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">API 사용량 대시보드</h1>
          <p className="text-sm sm:text-base text-gray-600">현재 계정의 할당량 및 사용 현황</p>
        </div>

        <TokenInput
          token={token}
          loading={loading}
          saveToken={saveToken}
          error={error}
          onTokenChange={handleTokenChange}
          onSaveTokenChange={handleSaveTokenChange}
          onFetch={fetchApiData}
          onKeyPress={handleKeyPress}
        />

        {apiData && (
          <>
            <PremiumInteractionsCard quota={apiData.quota_snapshots.premium_interactions} />
            <QuotaList quotas={apiData.quota_snapshots} />
            <DateCards assignedDate={apiData.assigned_date} quotaResetDate={apiData.quota_reset_date} />
            <AccountInfoGrid
              accessType={apiData.access_type_sku}
              copilotPlan={apiData.copilot_plan}
              chatEnabled={apiData.chat_enabled}
              canSignupForLimited={apiData.can_signup_for_limited}
            />
            <AnalyticsIdCard id={apiData.analytics_tracking_id} />
          </>
        )}

        {!apiData && !loading && <NoDataCard />}
      </div>
    </div>
  )
}
