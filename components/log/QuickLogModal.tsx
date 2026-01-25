'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Slider } from '@/components/ui/Slider'
import { SegmentedToggle } from '@/components/ui/SegmentedToggle'
import { Button } from '@/components/ui/Button'
import { Session } from '@/lib/types/session'

const DIFFICULTY_LABELS = ['매우 쉬움', '쉬움', '보통', '어려움', '매우 어려움']

interface QuickLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (difficulty: number, result: 'success' | 'failure') => void
  session: Session | null
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  session,
}) => {
  const [difficulty, setDifficulty] = useState(3)
  const [result, setResult] = useState<'success' | 'failure'>('success')
  const [isSaving, setIsSaving] = useState(false)
  const prevIsOpenRef = useRef(false)

  // 모달이 열릴 때만 초기값 설정 (한 번만 실행)
  useEffect(() => {
    // isOpen이 false에서 true로 변경될 때만 초기화
    const justOpened = isOpen && !prevIsOpenRef.current
    prevIsOpenRef.current = isOpen

    if (!justOpened || !session) {
      return
    }

    // 이미 저장된 로그가 있으면 그 값 사용
    if (session.logDifficulty !== undefined) {
      setDifficulty(session.logDifficulty)
    }
    if (session.logResult) {
      setResult(session.logResult)
    } else if (session.judge) {
      // 저장된 로그가 없으면 Judge 결과에 따라 기본값 설정
      const defaultResult = session.judge.verdict === 'PASS' || session.judge.verdict === 'LIKELY_PASS' 
        ? 'success' 
        : 'failure'
      setResult(defaultResult)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]) // isOpen만 의존성으로 사용하여 무한 루프 방지

  const handleSave = async () => {
    setIsSaving(true)
    // 약간의 딜레이로 UX 개선
    await new Promise((resolve) => setTimeout(resolve, 300))
    onSave(difficulty, result)
    setIsSaving(false)
    onClose()
  }

  const handleSkip = () => {
    onClose()
  }

  if (!session) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title="방금 푼 문제, 기록해두세요"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* 문제 정보 */}
        <div className="pb-4 border-b border-[rgba(255,255,255,0.06)]">
          <h3 className="text-base font-medium text-text-primary mb-1">
            {session.problem.title}
          </h3>
          <p className="text-sm text-text-muted">
            {session.problem.platform} • {session.problem.difficulty}
          </p>
        </div>

        {/* 체감 난이도 */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            체감 난이도
          </label>
          <div className="space-y-3">
            <Slider
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">
                {DIFFICULTY_LABELS[difficulty - 1]}
              </span>
              <span className="text-sm text-text-muted">
                {difficulty} / 5
              </span>
            </div>
          </div>
        </div>

        {/* 풀이 결과 */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            풀이 결과
          </label>
          <SegmentedToggle
            options={[
              { value: 'success', label: '성공' },
              { value: 'failure', label: '실패' },
            ]}
            value={result}
            onChange={(value) => setResult(value as 'success' | 'failure')}
            className="w-full"
          />
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleSkip}
            disabled={isSaving}
            className="flex-1"
          >
            건너뛰기
          </Button>
        </div>
      </div>
    </Modal>
  )
}
