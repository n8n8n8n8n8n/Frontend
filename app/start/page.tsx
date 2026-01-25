'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSessionStore } from '@/lib/store/sessionStore'
import { Problem } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

// 더미 문제 리스트
const DUMMY_PROBLEMS: Problem[] = [
  {
    id: 'dummy-1',
    title: 'Two Sum',
    platform: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    url: 'https://leetcode.com/problems/two-sum/',
  },
  {
    id: 'dummy-2',
    title: 'Binary Search',
    platform: 'BOJ',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    url: 'https://www.acmicpc.net/problem/1920',
  },
  {
    id: 'dummy-3',
    title: 'Valid Parentheses',
    platform: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    url: 'https://leetcode.com/problems/valid-parentheses/',
  },
  {
    id: 'dummy-4',
    title: 'Merge Two Sorted Lists',
    platform: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  },
  {
    id: 'dummy-5',
    title: 'Maximum Subarray',
    platform: 'BOJ',
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'DP'],
    url: 'https://www.acmicpc.net/problem/1912',
  },
  {
    id: 'dummy-6',
    title: '계단 오르기',
    platform: 'BOJ',
    difficulty: 'Easy',
    tags: ['Math', 'DP', 'Memoization'],
    url: 'https://www.acmicpc.net/problem/2579',
  },
  {
    id: 'dummy-7',
    title: 'Best Time to Buy and Sell Stock',
    platform: 'LeetCode',
    difficulty: 'Easy',
    tags: ['Array', 'DP'],
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  },
  {
    id: 'dummy-8',
    title: 'Valid Anagram',
    platform: 'BOJ',
    difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Sorting'],
    url: 'https://www.acmicpc.net/problem/6996',
  },
]

function inferPlatform(url: string): string {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('leetcode')) return 'LeetCode'
  if (lowerUrl.includes('boj') || lowerUrl.includes('acmicpc')) return 'BOJ'
  if (lowerUrl.includes('programmers')) return 'Programmers'
  return 'custom'
}

function getDifficultyColor(difficulty: string): string {
  const lower = difficulty.toLowerCase()
  if (lower === 'easy') return 'text-green-400'
  if (lower === 'medium') return 'text-yellow-400'
  if (lower === 'hard') return 'text-red-400'
  return 'text-text-muted'
}

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

type SearchState = 'idle' | 'loading' | 'success' | 'failure'

export default function StartPage() {
  const router = useRouter()
  const { createSession } = useSessionStore()
  const [urlInput, setUrlInput] = useState('')
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null)
  const [searchState, setSearchState] = useState<SearchState>('idle')

  // Extract problem number from input (e.g., "1920", "2178", "two-sum")
  const extractProblemNumber = (input: string): string | null => {
    const trimmed = input.trim()
    // Extract numbers from URL or plain number
    const numberMatch = trimmed.match(/\/(\d+)/) || trimmed.match(/^(\d+)$/)
    if (numberMatch) return numberMatch[1]
    
    // Extract slug from URL (e.g., "two-sum" from leetcode URL)
    const slugMatch = trimmed.match(/\/([^\/]+)\/?$/)
    if (slugMatch) return slugMatch[1]
    
    return null
  }

  // Search for problem in DUMMY_PROBLEMS by number or URL
  const searchProblem = async (input: string): Promise<Problem | null> => {
    const problemNumber = extractProblemNumber(input)
    if (!problemNumber) return null

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Search in DUMMY_PROBLEMS
    const found = DUMMY_PROBLEMS.find(problem => {
      if (!problem.url) return false
      const problemNum = extractProblemNumber(problem.url)
      return problemNum === problemNumber || problem.url.includes(problemNumber)
    })

    return found || null
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return

    setSearchState('loading')
    setPreviewProblem(null)

    try {
      const problem = await searchProblem(urlInput.trim())
      
      if (problem) {
        setPreviewProblem(problem)
        setSearchState('success')
      } else {
        setSearchState('failure')
      }
    } catch (error) {
      setSearchState('failure')
    }
  }

  const handleStartSession = (problem: Problem) => {
    const sessionId = createSession(problem)
    router.push(`/solve/${sessionId}`)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="mb-2">
            <Link 
              href="/home"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈
            </Link>
          </div>
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-primary mb-3"
            style={{ letterSpacing: '-0.02em', fontWeight: 600 }}
          >
            세션 시작하기
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            문제 하나를 선택하세요. 기억에 오래 남도록 도와드릴게요.
          </p>
        </div>

        <div className="space-y-10">
          {/* Section A: Load by URL/ID */}
          <div>
            <div className="mb-4">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                URL/ID로 불러오기
              </span>
            </div>
            <Card>
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="문제 URL 또는 ID를 입력하세요"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" variant="secondary" size="md" className="w-full sm:w-auto">
                  불러오기
                </Button>
              </form>

              {/* Loading state */}
              {searchState === 'loading' && (
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-text-muted">
                      <div className="w-5 h-5 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">문제를 찾는 중...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Success state: Preview */}
              {searchState === 'success' && previewProblem && (
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="mb-3">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      미리보기
                    </span>
                  </div>
                  <Card variant="outlined" className="p-0 overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-text-primary mb-1.5 truncate">
                          {previewProblem.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('text-xs font-medium', getPlatformColor(previewProblem.platform))}>
                            {previewProblem.platform}
                          </span>
                          <span className="text-text-muted text-xs">•</span>
                          <span className={cn('text-xs font-medium', getDifficultyColor(previewProblem.difficulty))}>
                            {previewProblem.difficulty}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className="h-[36px] px-4 text-[13px] rounded-[8px] border-[rgba(255,255,255,0.06)] bg-background-tertiary hover:bg-accent hover:border-accent hover:text-white transition-all duration-200"
                        onClick={() => handleStartSession(previewProblem)}
                      >
                        시작
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Failure state */}
              {searchState === 'failure' && (
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="text-center py-6">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(53,192,130,0.12)] mb-3">
                        <svg className="w-6 h-6 text-[#35c082]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-base font-medium text-text-primary mb-2">
                      문제를 찾을 수 없어요
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-md mx-auto">
                      해당 문제 번호에 맞는 문제가 존재하지 않아요.
                      <br />
                      문제 번호를 다시 확인하거나 직접 문제를 등록해 주세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                          setUrlInput('')
                          setSearchState('idle')
                          setPreviewProblem(null)
                          // Focus on input after clearing
                          setTimeout(() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement
                            input?.focus()
                          }, 100)
                        }}
                        className="min-w-[160px]"
                      >
                        문제 번호 다시 입력
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          // Create a manual problem entry
                          const platform = inferPlatform(urlInput.trim())
                          const problemId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                          const manualProblem: Problem = {
                            id: problemId,
                            title: urlInput.trim(),
                            platform,
                            difficulty: 'Unknown',
                            tags: [],
                            url: urlInput.trim(),
                          }
                          handleStartSession(manualProblem)
                        }}
                        className="min-w-[160px]"
                      >
                        직접 문제 등록하기
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Section B: Pick from dummy list */}
          <div>
            <div className="mb-4">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                목록에서 선택하기
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DUMMY_PROBLEMS.map((problem) => (
                <Card
                  key={problem.id}
                  className="hover:border-[rgba(255,255,255,0.1)] transition-colors duration-150 p-4 flex flex-col justify-between min-h-[140px]"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-2">
                        {problem.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className={cn('text-xs font-medium', getPlatformColor(problem.platform))}>
                          {problem.platform}
                        </span>
                        <span className="text-text-muted text-xs">•</span>
                        <span className={cn('text-xs font-medium', getDifficultyColor(problem.difficulty))}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="muted" className="text-[10px] py-0 px-1.5 h-4">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="secondary"
                      className="h-[34px] px-3.5 text-[13px] rounded-[8px] border-[rgba(255,255,255,0.06)] bg-background-tertiary hover:bg-accent hover:border-accent hover:text-white transition-all duration-200 shadow-none"
                      onClick={() => handleStartSession(problem)}
                    >
                      시작
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
