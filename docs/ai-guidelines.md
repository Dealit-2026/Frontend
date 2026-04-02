# AI 작업 기준 문서 (Codex / Copilot 공통)

## 📌 목적

이 문서는 AI 도구(Codex, GitHub Copilot 등)가  
이 레포지토리에서 작업할 때 반드시 따라야 하는 기준을 정의한다.

👉 이 문서를 따르지 않는 수정은 **잘못된 작업으로 간주한다.**

---

## 🧱 프로젝트 기본 환경

- Framework: **Next.js (최신 버전, App Router 기준)**
- Language: **TypeScript**
- Styling: **Tailwind CSS v4**
- Runtime: **Node.js**
- Deployment: **Vercel**
- 구조: **모바일 퍼스트 웹앱**

---

## 🔄 현재 프로젝트 상태

이 프로젝트는 다음 상태이다:

👉 **React + Vite 기반 → Next.js로 마이그레이션 진행 중**

현재 진행 단계:

1. package.json 수정 완료
2. 설정 파일 점검 및 생성 단계
3. 이후 구조 변경 예정

---

## 🚨 가장 중요한 원칙

### ❗ 1. 한 번에 전체 리팩토링 금지

- 전체 프로젝트 구조를 한 번에 변경하지 말 것
- 반드시 **단계별 작업** 수행

---

### ❗ 2. 작업 범위 절대 초과 금지

AI는 반드시 “현재 요청된 범위만” 수정해야 한다.

예:

| 요청              | 허용 | 금지             |
| ----------------- | ---- | ---------------- |
| package.json 수정 | ✔    | src 수정 ❌      |
| 설정 파일 수정    | ✔    | 컴포넌트 변경 ❌ |

---

### ❗ 3. 기존 코드 함부로 삭제 금지

다음 라이브러리는 유지 대상:

- @google/genai
- dotenv
- express
- lucide-react
- motion
- ts-morph
- tsx

👉 Vite 관련이 아닌 이상 **임의 삭제 금지**

---

### ❗ 4. 구버전 예시 적용 금지

다음 방식 금지:

- Next.js 구버전 설정 사용
- Tailwind v3 방식 적용
- 블로그 예시 그대로 복붙

👉 반드시 **현재 스택 기준으로 판단**

---

## ⚙️ Next.js 기준

### ✔ 허용

- 최소 설정 유지
- App Router 고려

### ❌ 금지

- `output: "export"`
- `swcMinify`
- 불필요한 experimental 설정
- webpack 커스텀 설정

---

## 🎨 Tailwind CSS 기준 (중요)

### 현재 버전

👉 **Tailwind CSS v4**

---

### ✔ 반드시 지킬 것

- 최소 설정 유지
- theme 확장 금지 (현재 단계)
- plugins 비워둘 것

---

### ❌ 절대 금지

- content 배열 강제 작성 (v3 방식)
- autoprefixer를 tailwind.config에 추가
- 복잡한 theme 설정

---

## 📦 PostCSS 기준

- `@tailwindcss/postcss` 사용
- autoprefixer는 PostCSS에서 처리

👉 tailwind.config에서 다루지 않는다

---

## 📁 파일 작업 범위

### ✔ 생성/수정 가능

- next.config.\*
- tailwind.config.\*
- postcss.config.\*
- eslint.config.\*

---

### ❌ 금지 (현재 단계)

- vercel.json 생성
- tsconfig 수정
- src 구조 변경
- 컴포넌트 수정
- globals.css 수정

---

## 🧠 AI 작업 방식

AI는 반드시 아래 순서를 따른다:

1. 현재 상태 분석
2. 작업 범위 확인
3. 최소 변경 수행
4. 불필요한 변경 제거

---

## 📌 판단 체크리스트

모두 YES일 때만 수정 가능:

- Next.js 전환에 직접 관련 있는가?
- 요청 범위 안인가?
- 팀 스택과 맞는가?
- 기존 코드 삭제를 유발하지 않는가?
- 실제 실행 가능한가?

👉 하나라도 NO면 수정 금지

---

## 🔥 금지 행동 요약

- 전체 프로젝트 구조 변경
- src 폴더 수정
- 컴포넌트 수정
- Tailwind v3 방식 적용
- Next.js 구버전 설정 사용
- 불필요한 패키지 삭제
- vercel.json 생성

---

## 🧭 작업 순서 (중요)

1. package.json ✔
2. 설정 파일 (next, tailwind, postcss)
3. eslint 설정
4. tsconfig
5. 폴더 구조
6. 컴포넌트

👉 반드시 이 순서 유지

---

## 📣 AI에게 전달 문장

## 작업 시 반드시 포함:

## ✅ 최종 목표

- 안정적인 Next.js 마이그레이션
- 팀 기준 유지
- 불필요한 리팩토링 방지
- 실무 수준 구조 확보

---

## 🧪 변경 후 검증 기준 (추가)

AI는 모든 수정 이후 아래 검증을 고려해야 한다:

### ✔ 기본 검증

- `npm install` 정상 실행
- `npm run dev` 실행 가능 여부 확인

### ✔ 설정 변경 시

- Next.js 빌드 오류 발생 여부 확인
- Tailwind 적용 여부 확인 (스타일 깨짐 여부)

### ❌ 금지

- 검증 없이 “작동할 것이라고 가정”하는 수정
- 실행 확인 없이 구조 변경

---

## 🧭 마이그레이션 단계 정의 (추가)

현재 프로젝트는 아래 단계로 진행된다:

1. package.json 수정 ✔
2. 설정 파일 정리 (next, tailwind, postcss)
3. eslint 설정
4. tsconfig 정리
5. src 구조 전환 (App Router)
6. 컴포넌트 마이그레이션

👉 AI는 반드시 현재 단계만 수행해야 한다

---

## 🧱 금지 예시 (구체화)

다음과 같은 설정은 추가 금지:

````js
// ❌ 구버전 Next.js 설정
output: "export"
swcMinify: true
experimental: {
  appDir: true
}
// ❌ Tailwind v3 방식
content: ["./src/**/*.{js,ts,jsx,tsx}"]
plugins: [require('autoprefixer')]
👉 위 방식은 현재 프로젝트 기준과 맞지 않는다


---

# 📊 최종 평가 (내 기준)

| 항목 | 평가 |
|------|------|
| 구조 | 매우 좋음 |
| 방향성 | 정확함 |
| Tailwind 이해 | ❌ 틀림 |
| 실무 적용성 | 높음 |
| 보완 필요성 | 약간 있음 |

---

# 🔥 최종 결론

👉 이 기준서는 이미 “실무 사용 가능한 수준”이다
👉 다만 **Tailwind 관련은 절대 수정하지 말고 유지**
👉 대신 **검증 + 예시 + 단계 정의만 추가하면 완성형 된다**

---

# 🧭 다음 단계 (진짜 중요)

이제 해야 할 것:

👉 기준서 업데이트 (위 추가 블록 반영)

그리고 바로:

```text
docs/ai-guidelines.md 기준으로
현재 nextdealit 프로젝트 상태를 분석해줘
````
