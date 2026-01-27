'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/lib/store/sessionStore'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function ReviewDevPage() {
  const router = useRouter()
  const createSession = useSessionStore((s) => s.createSession)
  const updateSession = useSessionStore((s) => s.updateSession)
  const getTodayReviews = useSessionStore((s) => s.getTodayReviews)
  const [isCreating, setIsCreating] = useState(false)
  const [created, setCreated] = useState(false)

  const handleCreateTestReview = () => {
    setIsCreating(true)
    
    // 테스트용 문제 생성
    const testProblem = {
      id: 'dev-test-problem-1',
      title: 'Two Sum',
      platform: 'LeetCode',
      difficulty: 'medium',
      tags: ['Array', 'Hash Table'],
      url: 'https://leetcode.com/problems/two-sum/',
    }

    // 세션 생성
    const sessionId = createSession(testProblem)

    // 복습용 데이터 설정
    const now = new Date()
    const todayReviewAt = new Date(now)
    todayReviewAt.setHours(0, 0, 0, 0)
    
    updateSession(sessionId, {
      understandingAnswers: {
        q1: '해시 테이블을 사용하여 각 숫자와 인덱스를 저장하고, 목표값에서 현재 숫자를 뺀 값이 해시 테이블에 있는지 확인하는 방식으로 해결했습니다.',
        q2: '시간 복잡도는 O(n), 공간 복잡도는 O(n)입니다. 배열을 한 번 순회하면서 해시 테이블에 저장하고 조회하기 때문입니다.',
        q3: '중복된 숫자가 있을 수 있지만, 해시 테이블의 마지막 인덱스가 저장되므로 문제없습니다. 빈 배열이나 요소가 2개 미만인 경우는 제약 조건에서 처리됩니다.',
      },
      understandingLevel: 'PARTIAL',
      reviewAt: todayReviewAt.toISOString(),
      status: 'SCHEDULED',
      judge: {
        verdict: 'PASS',
        confidence: 4,
        reasons: ['모든 테스트 케이스를 통과했습니다'],
        createdAt: new Date().toISOString(),
      },
    })

    setIsCreating(false)
    setCreated(true)
    
    // 복습 페이지로 리다이렉트
    setTimeout(() => {
      router.push('/review')
    }, 1000)
  }

  const handleGoToReview = () => {
    router.push('/review')
  }

  const todayReviews = getTodayReviews(new Date())

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-2" style={{ letterSpacing: '-0.02em', fontWeight: 600 }}>
              개발자용 복습 테스트
            </h1>
            <p className="text-sm text-text-muted mt-2">
              테스트용 복습 항목을 생성하고 복습 UI를 확인할 수 있습니다.
            </p>
          </div>

          <Card className="mb-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-text-primary mb-2">
                  현재 상태
                </h2>
                <p className="text-sm text-text-muted">
                  오늘 복습할 항목: <span className="font-medium text-text-primary">{todayReviews.length}개</span>
                </p>
              </div>

              {created ? (
                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-sm text-[#35c082] mb-4">
                    ✓ 테스트용 복습 항목이 생성되었습니다. 복습 페이지로 이동합니다...
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleGoToReview}
                  >
                    복습 페이지로 이동
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <Button
                    variant="primary"
                    onClick={handleCreateTestReview}
                    disabled={isCreating}
                  >
                    {isCreating ? '생성 중...' : '테스트용 복습 항목 생성'}
                  </Button>
                  <p className="text-xs text-text-muted mt-3">
                    오늘 복습할 항목이 있는 세션을 생성합니다. 생성 후 자동으로 복습 페이지로 이동합니다.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {todayReviews.length > 0 && (
            <Card>
              <div className="space-y-3">
                <h2 className="text-lg font-medium text-text-primary mb-2">
                  현재 복습할 항목 목록
                </h2>
                {todayReviews.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-lg bg-background-tertiary border border-[rgba(255,255,255,0.06)]"
                  >
                    <h3 className="text-base font-medium text-text-primary mb-1">
                      {session.problem.title}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {session.problem.platform} • {session.problem.difficulty}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
