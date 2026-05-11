# 결제/영수증 PR 체크리스트

## 요약

- 일반 구매 결제 플로우 API 연동
- 결제 후 채팅방 생성/이동 및 실패 fallback(영수증)
- 영수증 상태 복원 및 판매자/구매자 액션(`ship`/`receive`) 연동
- 에러 코드별 UX 메시지 매핑

---

## 구현 범위 체크

- [ ] 결제 화면에서 상품 구매 가능 여부/지갑 잔액 기반 버튼 상태 반영
- [ ] 잔액 부족 시 충전 모달 및 `wallet/charge` 연동
- [ ] 결제 성공 후 채팅방 생성 호출
- [ ] 채팅방 생성 실패 시 영수증 fallback 이동
- [ ] 영수증 화면에서 `purchaseId` 기반 상태 조회
- [ ] 영수증에서 판매자 `ship`, 구매자 `receive` 액션 호출
- [ ] 액션 후 영수증 상태 재조회
- [ ] 주요 에러 코드별 메시지 처리

---

## API 연동 체크

- [ ] `GET /api/v1/products/{productId}`
- [ ] `GET /api/v1/wallet`
- [ ] `POST /api/v1/wallet/charge`
- [ ] `POST /api/v1/products/{productId}/purchase`
- [ ] `POST /api/v1/chats/rooms`
- [ ] `GET /api/v1/purchases/{purchaseId}`
- [ ] `POST /api/v1/purchases/{purchaseId}/ship`
- [ ] `POST /api/v1/purchases/{purchaseId}/receive`

---

## 상태/권한 체크

- [ ] 구매자/판매자 역할 판별 후 버튼 노출 규칙 일치
- [ ] `PAID -> SHIPPED -> COMPLETED` 흐름 반영
- [ ] `PAID -> CANCELED` 상태 표시 반영
- [ ] 완료/취소 상태에서 진행 액션 비활성/비진행

---

## 테스트 체크

- [ ] 수동 테스트 문서 기준 주요 시나리오 점검 완료
- [ ] 예외/오류 응답 시 UX 확인 완료
- [ ] 회귀 체크 완료(네비게이션/인증 만료/재진입)

---

## 첨부

- 테스트 문서: `docs/payment-receipt-manual-test.md`
- 관련 변경 파일:
  - `src/app/products/[productId]/payment/index.tsx`
  - `src/app/products/[productId]/receipt/page.tsx`
  - `src/app/products/[productId]/receipt/index.tsx`
  - `src/services/product/purchase/types.ts`
  - `src/services/product/purchase/api.ts`
  - `src/services/product/purchase/service.ts`
  - `src/services/wallet/api.ts`
  - `src/services/apiError.ts`
