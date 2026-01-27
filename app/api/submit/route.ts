import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = 'https://primary-production-b57a.up.railway.app/webhook/submit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 필수 필드 검증
    if (!body.code || typeof body.code !== 'string' || !body.code.trim()) {
      return NextResponse.json(
        { error: '코드는 필수이며 비어있을 수 없습니다.' },
        { status: 400 }
      )
    }

    // n8n 웹훅으로 요청 전달
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: body.userId || 'test-user',
        problemId: parseInt(String(body.problemId), 10) || 1000,
        language: 'python',
        code: body.code.trim(),
        timeSpentMin: parseInt(String(body.timeSpentMin), 10) || 10,
        hintUsed: Boolean(body.hintUsed),
        selfReportDifficulty: parseInt(String(body.selfReportDifficulty), 10) || 3,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `웹훅 요청 실패: HTTP ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    // 응답 본문 확인
    const responseText = await response.text()
    if (!responseText || responseText.trim() === '') {
      return NextResponse.json(
        { error: '서버에서 빈 응답을 받았습니다.' },
        { status: 502 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError, '응답 본문:', responseText)
      return NextResponse.json(
        { 
          error: '서버 응답을 파싱할 수 없습니다.', 
          details: parseError instanceof Error ? parseError.message : '알 수 없는 오류',
          rawResponse: responseText.substring(0, 500) // 처음 500자만 전송
        },
        { status: 502 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API 라우트 에러:', error)
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.', details: error.message },
      { status: 500 }
    )
  }
}
