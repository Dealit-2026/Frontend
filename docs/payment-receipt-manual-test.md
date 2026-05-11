# 결제/영수증 수동 테스트 체크리스트

## 테스트 전 준비

- 로그인 사용자 2명 준비: 구매자, 판매자
- 테스트 상품 1개 준비: 일반 판매 상품(`ON_SALE`, 구매 가능)
- 구매자 지갑 잔액 시나리오 준비
  - 부족 케이스: 가격보다 낮은 잔액
  - 충분 케이스: 가격 이상 잔액

---

## 1. 결제 버튼 상태 검증

### 1-1. 구매 불가 상품

- 조건: `canPurchase=false`
- 기대 결과:
  - 결제 버튼 비활성화
  - `purchaseBlockedReason`에 맞는 문구 노출

### 1-2. 잔액 부족

- 조건: `canPurchase=true`, `wallet.balance < price`
- 기대 결과:
  - 버튼 텍스트: `딜릿머니 충전하기`
  - 클릭 시 충전 모달 표시

### 1-3. 잔액 충분

- 조건: `canPurchase=true`, `wallet.balance >= price`
- 기대 결과:
  - 버튼 텍스트: `딜릿머니로 구매하기`
  - 클릭 시 구매 API 호출 시작

---

## 2. 충전 플로우 검증

### 2-1. 충전 성공

- 동작: 충전 모달에서 금액 입력 후 충전
- 기대 결과:
  - `POST /api/v1/wallet/charge` 성공
  - 화면 잔액 즉시 갱신
  - 결제 버튼 상태 재계산

### 2-2. 충전 실패

- 기대 결과:
  - 실패 토스트 노출
  - 모달 유지

---

## 3. 결제 후 이동 플로우 검증

### 3-1. 채팅방 생성 성공

- 동작: 결제 성공 후 `POST /api/v1/chats/rooms` 성공
- 기대 결과:
  - `/chats/{roomId}` 이동

### 3-2. 채팅방 생성 실패 fallback

- 동작: 결제 성공 후 채팅방 생성 실패 유도
- 기대 결과:
  - `/products/{productId}/receipt?purchaseId={id}` 이동

---

## 4. 영수증 상태 복원 검증

### 4-1. 진입 시 조회

- 동작: `purchaseId` 쿼리 포함 URL 진입
- 기대 결과:
  - `GET /api/v1/purchases/{purchaseId}` 호출
  - 상품명/금액/상태/시각 실데이터 렌더링

### 4-2. `PAID` 상태

- 판매자 계정:
  - `물건을 보냈어요` 버튼 활성
- 구매자 계정:
  - `물건을 받았어요` 비활성(또는 일반 확인), 안내 문구 노출

### 4-3. `SHIPPED` 상태

- 구매자 계정:
  - `물건을 받았어요` 버튼 활성
- 판매자 계정:
  - 구매자 수령확정 대기 안내 문구 노출

### 4-4. `COMPLETED` / `CANCELED` 상태

- 기대 결과:
  - 상태 라벨/안내 문구가 완료/취소에 맞게 노출
  - 액션 버튼은 거래 진행 액션을 수행하지 않음

---

## 5. 상태 전이 액션 검증

### 5-1. 판매자 발송 완료

- 조건: 판매자 + `PAID`
- 동작: `물건을 보냈어요` 클릭
- 기대 결과:
  - `POST /api/v1/purchases/{purchaseId}/ship` 성공
  - 재조회 후 상태 `SHIPPED` 반영

### 5-2. 구매자 수령 확정

- 조건: 구매자 + `SHIPPED`
- 동작: `물건을 받았어요` 클릭
- 기대 결과:
  - `POST /api/v1/purchases/{purchaseId}/receive` 성공
  - 재조회 후 상태 `COMPLETED` 반영

---

## 6. 에러 코드 UX 검증

아래 코드별로 사용자 메시지 매핑 확인:

- `INSUFFICIENT_BALANCE`
- `PRODUCT_NOT_PURCHASABLE`
- `PURCHASE_NOT_COMPLETABLE`
- `PURCHASE_FORBIDDEN`
- `PURCHASE_NOT_FOUND`
- `IDEMPOTENCY_CONFLICT`
- `INVALID_REQUEST`
- `VALIDATION_ERROR`
- `TOKEN_EXPIRED`
- `INVALID_TOKEN`

각 케이스 기대 결과:

- 코드에 맞는 안내 문구 노출
- 필요한 경우(예: 잔액 부족) 충전 유도 동작 발생

---

## 7. 회귀 체크

- 결제 화면 진입/뒤로가기 정상
- 채팅방 이동 이후 앱 내 내비게이션 정상
- 영수증 화면 새로고침 시 상태 복원 유지
- 인증 만료 시 로그인 유도 동작 정상
