nextdealit/
├─ docs/
│ └─ ai-guidelines.md
├─ src/
│ ├─ app/
│ │ ├─ (auth)/ # 인증/가입 플로우 그룹
│ │ │ ├─ login/
│ │ │ ├─ signup/
│ │ │ ├─ find-id/
│ │ │ ├─ find-password/
│ │ │ ├─ region-setup/
│ │ │ ├─ find-location/
│ │ │ ├─ phone-auth/
│ │ │ ├─ terms/
│ │ │ ├─ profile-setup/
│ │ │ └─ category-selection/
│ │ ├─ (main)/ # 앱 사용 후 메인 탭/마이페이지 그룹
│ │ │ ├─ layout.tsx
│ │ │ ├─ home/
│ │ │ ├─ search/
│ │ │ │ └─ detail/
│ │ │ ├─ notifications/
│ │ │ │ └─ settings/
│ │ │ ├─ wishlist/
│ │ │ └─ mypage/
│ │ │ ├─ account-management/
│ │ │ ├─ my-bids/
│ │ │ ├─ purchase-history/
│ │ │ ├─ sales-history/
│ │ │ ├─ sales-management/
│ │ │ └─ review/write/
│ │ ├─ products/ # 상품 일반거래 도메인
│ │ │ ├─ register/
│ │ │ └─ [productId]/
│ │ │ ├─ payment/
│ │ │ ├─ receipt/
│ │ │ ├─ regular-purchase/
│ │ │ └─ report/
│ │ ├─ auctions/ # 경매 도메인
│ │ │ ├─ register/
│ │ │ └─ [auctionId]/
│ │ │ ├─ bidding-status/
│ │ │ ├─ bid-complete/
│ │ │ ├─ outbid/
│ │ │ └─ winning-complete/
│ │ ├─ chats/
│ │ │ └─ [roomId]/
│ │ ├─ page.tsx
│ │ ├─ layout.tsx
│ │ ├─ not-found.tsx
│ │ └─ globals.css
│ ├─ components/
│ │ ├─ common/ # 공통 UI
│ │ │ ├─ bottom-navigation/TabButton.tsx
│ │ │ ├─ modal/ConfirmModal.tsx
│ │ │ └─ ExploreIcon.tsx
│ │ └─ product/ # 상품 특화 UI
│ │ ├─ ProductCard.tsx
│ │ └─ ProductListItem.tsx
│ └─ types/
│ └─ index.ts
├─ package.json
├─ next.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json
├─ split.ts
├─ restructure.ts
└─ fix-paths.ts

## “파일 역할 + 내부 코드 쓰임” 문서화를 위한 설명 템플릿 (세부)

아래 방식으로 문서화하면 가장 실무적으로 읽기 좋습니다.

---

### A. 앱 엔트리/레이아웃

### **`src/app/layout.tsx`**

- 역할: 전역 HTML 스켈레톤, 글로벌 CSS 적용, metadata 설정.
- 핵심: 앱 전체 공통 래퍼(**`<html lang="ko">`**, **`<body>`**).

### **`src/app/page.tsx`**

- 역할: 현재 프로젝트의 “실질 라우팅 컨트롤러” (상태 기반 화면 전환 허브).
- 핵심 메서드 예시:
  - **`showToast(message)`**: 토스트 상태 표시/해제.
  - **`navigateTo(screen)`**: 화면 전환 상태 변경.
  - **`navigateToProduct(id)`**: 상품 선택 + 상세 이동.
- 주의: **`currentScreen === ...`** 분기 렌더링이 길게 이어짐.

### **`src/app/not-found.tsx`**

- 역할: 404 화면 제공.

---

### B. 인증/메인 도메인 화면

### **`src/app/(auth)/*`**

- 역할: 로그인/회원가입/인증/약관/프로필/관심 카테고리 단계.
- 예시 메서드:
  - **`CategorySelectionScreen`**의 카테고리 토글(**`toggleCategory`**)로 다중 선택 관리.

### **`src/app/(main)/layout.tsx`**

- 역할: 홈/탐색/등록/채팅/마이 탭 화면 조립, 하단 탭바 제어.
- 핵심 로직:
  - **`lastTab`**, **`displayTab`**로 등록 화면 오버레이 동작 제어.

---

### C. 상품/경매/채팅 도메인

### **`src/app/products/[productId]/page.tsx`**

- 역할: 상품 상세 + 입찰/구매 액션 처리.
- 상태 예시:
  - **`currentPrice`**, **`bidCount`**, **`inputBidAmount`**, **`showBidSheet`** 등 UI 상태 관리.
- 이벤트 예시:
  - 관심 토글/토스트, 신고 버튼, 입찰 완료 콜백 전달.

### **`src/app/auctions/page.tsx`**

- 역할: 일반 상품 목록 컴포넌트를 **`mode="auction"`**으로 재사용하는 래퍼 화면.

### **`src/app/chats/[roomId]/page.tsx`**

- 역할: 채팅방 UI/상품 상단 카드/메시지 목록 표시.
- 예시: 상단 상품 영역 클릭 시 상품 상세 이동 이벤트 전달 (**`onProductClick(1)`**).

---

### D. 재사용 컴포넌트

### **`src/components/product/ProductCard.tsx`**

- 역할: 홈 카드형 상품 노출 UI.
- 예시: 찜 버튼 토글 **`setIsLiked`**, 카드 클릭 시 상위로 상품 ID 전달.
- 현재 특성: 랜덤 이미지 URL + 하드코딩 텍스트/가격 사용.

### **`src/components/product/ProductListItem.tsx`**

- 역할: 리스트형 상품 아이템.
- 예시 메서드:
  - **`handleLikeClick`**: 찜 해제 시 확인 모달 열기 조건 처리.
  - **`ConfirmModal`** 연계로 실제 해제 콜백 실행.

### **`src/components/common/modal/ConfirmModal.tsx`**

- 역할: 공통 확인 모달 (확인/취소, themeColor 반영).

## 1) **`nextdealit`** 앱 구조 (핵심)

- 기술 스택은 Next.js + React + TypeScript + Tailwind(PostCSS) 기반입니다.
- 스크립트는 **`dev/build/start/lint`**로 표준 Next.js 실행 흐름입니다.
- TypeScript 경로 별칭으로 **`@/* -> ./src/*`**가 설정되어 있습니다.

## 2) **`src`** 내부 도메인 분리

### **`src/app`** (라우트/화면)

- App Router 기반이며 전역 레이아웃(**`layout.tsx`**)과 글로벌 CSS를 사용합니다.
- 라우트 그룹이 **`(auth)`**, **`(main)`**으로 나뉘어 있고, 별도로 **`products`**, **`auctions`**, **`chats`** 도메인이 분리되어 있습니다.
- 특히 메인 진입 화면 **`src/app/page.tsx`**에서 인증/메인/상품/경매/채팅 등 다수 화면을 한 곳에서 import 하며 앱 전체 흐름을 묶고 있습니다.
- **`(main)/layout.tsx`**는 홈/탐색/등록/채팅/마이 탭 전환과 하단 탭바를 담당하는 허브 역할입니다.

### **`src/components`** (재사용 UI)

- **`common`**(공통), **`product`**(상품 특화)로 분리되어 있고, 실제로 하단 탭 버튼/모달/상품카드 같은 재사용 컴포넌트가 위치합니다.

### **`src/types`**

- 앱 전역 화면 상태(**`Screen`**)와 탭(**`Tab`**) 타입을 한 파일에서 중앙 관리합니다.

## 3) 현재 코드베이스의 특징 (구조 관점)

- **`split.ts`**, **`restructure.ts`**, **`fix-paths.ts`**가 존재해서, 단일 파일/기존 구조를 App Router/컴포넌트 구조로 자동 분해·이동한 이력이 보입니다.
- 그래서 일부 경로에는 **`index.tsx`**와 **`page.tsx`**가 함께 존재하는 형태가 보이며, 마이그레이션 흔적이 남아있는 구조입니다 (정리 가능 포인트).

---

### 한 줄 요약

- **라우팅 중심(`src/app`) + 재사용 UI(`src/components`) + 전역 타입(`src/types`)** 구조이며, App Router 그룹(**`(auth)`**, **`(main)`**)로 기능이 크게 나뉘어 있습니다.

## 결론

- **`(auth)`**의 10개 화면 디렉터리 중 **9개는 **`page.tsx`**와 **`index.tsx`**가 완전히 동일(IDENTICAL)**합니다.
- **`category-selection`만 DIFFERENT**인데, 실질 차이는 export 방식 1줄(**`export function`** vs **`export default function`**)입니다. 즉 내용은 거의 동일한 중복 코드입니다.

## 근거 예시

- **`login/page.tsx`**와 **`login/index.tsx`**는 같은 import/컴포넌트 선언을 갖고 있습니다.
- **`category-selection`**은 기능/구조가 동일하고 export 키워드만 다릅니다.
- 이 패턴은 과거 자동 구조 변경 스크립트(파일 이동/분해) 이력과도 맞아떨어집니다.

## 우선순위 제안 (실무 기준)

- **높음(바로 처리 권장):**
  - **`(auth)`**의 **`index.tsx`**/**`page.tsx`** 중 하나로 통일 (보통 Next App Router는 **`page.tsx`**만 유지).
- **중간:**
  - 인증 화면 공통 UI/폼 조각을 공통 컴포넌트로 추출.
- **중간~낮음:**
  - **`app/page.tsx`**의 상태 기반 거대 라우팅 로직을 실제 라우트 단위로 점진 분리.

---

---

### 핵심 리팩토링 패턴 요약

1. 각 auth 폴더에 **`XxxScreen.tsx`** 하나만 “실제 UI 컴포넌트”로 둠
2. **`page.tsx`**는 라우트 엔트리 래퍼 역할만 수행
3. **`app/page.tsx`**의 import를 **`./(auth)/login`** → **`./(auth)/login/LoginScreen`**으로 변경
4. 마지막에 **`index.tsx`** 삭제

---

근거로 현재 **`login/page.tsx`**와 **`login/index.tsx`**는 동일 코드이며,

**`category-selection`**도 export 문법만 다르고 구조는 같습니다.

사용한 명령: **`cmp`**, **`diff -u`**, **`nl -ba`**, **`npm run lint`** (ESLint 초기 설정 프롬프트로 중단).

- **`app/page.tsx`**에서 **`currentScreen`** 상태를 두고 문자열(**`"login"`**, **`"signup"`**, **`"main"`** 등)로 분기 렌더링을 길게 이어가고 있습니다.
- 각 화면 이동도 **`navigateTo("...")`** 콜백을 prop으로 넘겨서 수동 연결하고 있어, 화면 수가 늘수록 결합도가 급격히 올라가는 구조입니다.
- **`(main)/layout.tsx`**도 탭 전환을 **`displayTab === 'home'`** 같은 조건문으로 직접 처리하고 있습니다.

즉, 지금 구조는 **프로토타입/목업 단계에서 빠르게 만들기엔 좋지만**, 규모가 커지면 유지보수 난도가 올라가는 형태예요.

---

---

## 1) 이 구조가 “향후 메인 프론트엔드 + 백엔드/API 연동”에 적합한가?

**부분적으로는 적합하지만, 지금 상태 그대로를 “최종 메인 구조”로 쓰기엔 리팩토링이 필요**합니다.

### 적합한 점

- Next.js App Router 기반(**`src/app`**)이고, **`(auth)`**, **`(main)`**처럼 도메인 그룹을 나눈 방향 자체는 좋아요.
- 타입 정의(**`Screen`**, **`Tab`**)가 중앙화되어 있어 화면 상태 관리 의도는 명확합니다.
- **`package.json`**에 Next/React/TypeScript 기반이 이미 정리되어 있어 API 클라이언트 레이어를 붙이기 좋은 런타임입니다.

### 바로 메인 구조로 쓰기 어려운 점

- **`app/page.tsx`**가 화면 전환 허브 역할을 하며 상태 문자열로 분기 렌더링을 대규모로 처리합니다(하드코딩 전환). 규모가 커질수록 유지보수 비용이 큽니다.
- **`page.tsx`**와 **`index.tsx`** 중복이 매우 많아 변경 시 동기화 리스크가 큽니다(이미 확인하신 이슈).
- UI 내부가 더미 데이터 중심입니다(랜덤 이미지, 하드코딩 상품명/가격/배너). API 연동 전환을 위한 데이터 계층 분리가 아직 없습니다.
