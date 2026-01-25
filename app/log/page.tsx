'use client'

import { useMemo } from 'react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useSessionStore } from '@/lib/store/sessionStore'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'BOJ':
      return 'text-blue-400'
    case 'LeetCode':
      return 'text-orange-400'
    case 'Programmers':
      return 'text-purple-400'
    default:
      return 'text-text-muted'
  }
}

function getDifficultyColor(difficulty: string): string {
  const lower = difficulty.toLowerCase()
  if (lower === 'easy') return 'text-green-400'
  if (lower === 'medium') return 'text-yellow-400'
  if (lower === 'hard') return 'text-red-400'
  return 'text-text-muted'
}

function getLogDifficultyLabel(difficulty: number): string {
  const labels = ['매우 쉬움', '쉬움', '보통', '어려움', '매우 어려움']
  return labels[difficulty - 1] || '보통'
}

function formatDate(iso: string | undefined): string {
  if (!iso) return ''
  
  const date = new Date(iso)
  // 유효하지 않은 날짜인 경우 빈 문자열 반환
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '오늘'
  } else if (diffDays === 1) {
    return '어제'
  } else if (diffDays < 7) {
    return `${diffDays}일 전`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}주 전`
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}

export default function LogPage() {
  // sessions 객체를 직접 가져와서 useMemo 내부에서 처리
  const sessions = useSessionStore((state) => state.sessions)

  // 로그가 저장된 세션들만 필터링 (loggedAt이 있는 세션)
  const loggedSessions = useMemo(() => {
    // sessions가 없거나 빈 객체인 경우 빈 배열 반환
    if (!sessions || Object.keys(sessions).length === 0) {
      return []
    }

    const allSessions = Object.values(sessions)
    return allSessions
      .filter((session) => session && session.loggedAt)
      .sort((a, b) => {
        // 최신순 정렬
        const aDate = new Date(a.loggedAt || a.updatedAt)
        const bDate = new Date(b.loggedAt || b.updatedAt)
        return bDate.getTime() - aDate.getTime()
      })
  }, [sessions])

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-24 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-2" style={{ letterSpacing: '-0.02em', fontWeight: 600 }}>
              기록 히스토리
            </h1>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              지금까지 기록한 모든 문제를 확인할 수 있어요
            </p>
          </div>

          {/* Log List */}
          {loggedSessions.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-text-muted mb-4">아직 기록한 문제가 없어요</p>
              <p className="text-sm text-text-muted">
                문제를 풀고 제출하면 자동으로 기록할 수 있어요
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {loggedSessions.map((session) => {
                // session이나 problem이 없으면 렌더링하지 않음
                if (!session || !session.problem) {
                  return null
                }
                
                return (
                <Link
                  key={session.id}
                  href={`/solve/${session.id}`}
                  className="block"
                >
                  <Card className="hover:bg-background-tertiary transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <h3 className="text-base font-medium text-text-primary flex-1">
                            {session.problem.title || '제목 없음'}
                          </h3>
                          {session.loggedAt && (
                            <span className="text-xs text-text-muted whitespace-nowrap">
                              {formatDate(session.loggedAt)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {session.problem.platform && (
                            <>
                              <span className={cn('text-xs font-medium', getPlatformColor(session.problem.platform))}>
                                {session.problem.platform}
                              </span>
                              <span className="text-text-muted text-xs">•</span>
                            </>
                          )}
                          {session.problem.difficulty && (
                            <span className={cn('text-xs font-medium', getDifficultyColor(session.problem.difficulty))}>
                              {session.problem.difficulty}
                            </span>
                          )}
                          {session.problem.tags && session.problem.tags.length > 0 && session.problem.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="muted" className="text-[10px] py-0 px-1.5 h-4">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Log 정보 */}
                        <div className="flex items-center gap-4 text-sm">
                          {session.logDifficulty && (
                            <div className="flex items-center gap-2">
                              <span className="text-text-muted">체감 난이도:</span>
                              <span className="text-text-secondary">
                                {getLogDifficultyLabel(session.logDifficulty)} ({session.logDifficulty}/5)
                              </span>
                            </div>
                          )}
                          {session.logResult && (
                            <div className="flex items-center gap-2">
                              <span className="text-text-muted">결과:</span>
                              <Badge
                                variant={session.logResult === 'success' ? 'muted' : 'muted'}
                                className={cn(
                                  'text-xs',
                                  session.logResult === 'success'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                )}
                              >
                                {session.logResult === 'success' ? '성공' : '실패'}
                              </Badge>
                            </div>
                          )}
                          {session.judge && (
                            <div className="flex items-center gap-2">
                              <span className="text-text-muted">판정:</span>
                              <span className={cn(
                                'text-xs',
                                session.judge.verdict === 'PASS' || session.judge.verdict === 'LIKELY_PASS'
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              )}>
                                {session.judge.verdict === 'PASS' ? '통과' :
                                 session.judge.verdict === 'LIKELY_PASS' ? '통과 가능' :
                                 session.judge.verdict === 'FAIL' ? '실패' :
                                 session.judge.verdict === 'POSSIBLY_FAIL' ? '실패 가능' :
                                 session.judge.verdict === 'TLE_RISK' ? '시간 초과 위험' :
                                 session.judge.verdict}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
