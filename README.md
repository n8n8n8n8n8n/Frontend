# CodeBuddy

코딩 테스트 문제를 풀고 기록하며, AI 질문으로 이해도를 확인하고, 간격 반복 알고리즘으로 최적의 타이밍에 복습할 수 있는 학습 관리 서비스입니다.

## 서비스 소개

CodeBuddy는 단순히 문제를 풀고 넘어가는 것이 아니라, 풀이를 제대로 이해하고 오래 기억할 수 있도록 돕는 서비스입니다. 한 번 풀고 잊히는 풀이가 아니라, 코딩 테스트에서도 다시 꺼낼 수 있는 기억을 만들어줍니다.

### 주요 기능

- **문제 풀이**: Monaco Editor를 사용한 코드 작성 및 실행 (JavaScript, TypeScript, Python 지원)
- **AI 채점**: 코드 제출 시 AI Judge 시스템이 코드를 분석하고 판정, 이유, 엣지 케이스, 시간 복잡도 등을 제공
- **문제 기록**: 풀이 완료 후 난이도와 결과를 기록하여 학습 이력 관리
- **이해도 체크**: AI가 생성한 질문으로 문제에 대한 이해도를 확인하고 검증
- **복습 관리**: 간격 반복 알고리즘을 활용하여 최적의 타이밍에 복습 알림 제공

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand (로컬 스토리지 영속화)
- **코드 에디터**: Monaco Editor
- **AI 채점**: Judge 시스템 (코드 분석 및 피드백 생성)
- **폼 검증**: Zod

## 개발 상태

현재 프로젝트는 개발 중이며, 다음 사항들이 구현되어 있습니다:

- **코드 제출 및 채점**: 문제 풀이 후 코드를 제출하면 AI Judge 시스템이 코드를 분석하고 피드백을 제공합니다 (`lib/judge/client.ts`)
- **세션 관리**: Zustand를 사용한 세션 상태 관리 및 로컬 스토리지 영속화
- **코드 에디터**: Monaco Editor를 사용한 코드 작성 환경 (JavaScript, TypeScript, Python 지원)
- **데이터**: 모든 데이터는 더미 데이터를 사용합니다 (`lib/mock/data.ts`, `lib/api/index.ts`)
- **인증**: 로그인 기능은 형식상 구현되어 있으며, 이메일과 비밀번호에 아무 값이나 입력해도 로그인됩니다

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 모드로 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 프로젝트 구조

```
codebuddy/
├── app/                    # Next.js App Router 페이지
│   ├── home/              # 홈 대시보드
│   ├── login/             # 로그인 페이지
│   ├── start/             # 새 세션 시작
│   ├── solve/             # 문제 풀이
│   ├── check/             # 이해도 체크
│   ├── review/            # 복습
│   └── log/               # 기록 보기
├── components/            # React 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── navigation/       # 네비게이션 컴포넌트
│   └── ui/               # UI 컴포넌트
├── lib/                  # 유틸리티 및 로직
│   ├── api/              # API 레이어 (현재 더미 데이터)
│   ├── contexts/         # React Context
│   ├── judge/            # AI Judge 시스템 (코드 분석 및 채점)
│   ├── mock/             # 더미 데이터
│   ├── store/            # Zustand 스토어
│   ├── types/            # TypeScript 타입 정의
│   └── utils/            # 유틸리티 함수
└── public/               # 정적 파일
```

## 주요 페이지

- **랜딩 페이지** (`/`): 서비스 소개 및 사용 방법 안내
- **로그인** (`/login`): 로그인 및 회원가입 (현재 형식상 구현)
- **홈** (`/home`): 대시보드 및 주요 액션 안내
- **시작** (`/start`): 새로운 문제 풀이 세션 시작
- **풀이** (`/solve/[sessionId]`): 문제 풀이 및 코드 작성, 제출 후 AI Judge를 통한 채점 결과 확인
- **체크** (`/check/[sessionId]`): AI 질문을 통한 이해도 확인
- **복습** (`/review`): 복습할 문제 목록 및 복습 진행
- **기록** (`/log`): 풀었던 문제 기록 조회

## 주요 구현 사항

### 코드 제출 및 채점 시스템
- 코드 제출 시 AI Judge 시스템이 코드를 분석
- 판정 결과 (PASS, FAIL, LIKELY_PASS 등) 제공
- 판정 이유, 엣지 케이스, 시간 복잡도 분석 제공
- 신뢰도 점수 제공

### 세션 관리
- 문제 풀이 세션 생성 및 관리
- 코드 자동 저장 (debounced)
- 세션 상태 추적 (DRAFT, SUBMITTED, CHECKED, SCHEDULED)
- 로컬 스토리지를 통한 세션 영속화

### 코드 에디터
- Monaco Editor 통합
- JavaScript, TypeScript, Python 언어 지원
- 기본 언어: JavaScript
- 실시간 코드 하이라이팅 및 자동 완성

## 향후 계획

- 실제 인증 시스템 구현
- 데이터베이스 연동
- 복습 알림 시스템 구현
- 추가 프로그래밍 언어 지원 확대

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
