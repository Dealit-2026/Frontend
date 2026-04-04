# 프론트엔드 개발 가이드

## 목적

이 문서는 프론트엔드 코드의 역할 분리 기준과 서비스 레이어 구조를 정의한다.

목표는 다음과 같다.

- 화면 코드에서 API 상세를 숨긴다.
- 도메인 단위로 코드를 분리해 팀원이 독립적으로 작업할 수 있게 한다.
- 페이지 컴포넌트가 비대해지는 것을 막는다.
- API 변경에 대한 영향 범위를 줄인다.

---

## 프론트 구조 제안

프론트는 `services` 아래에 도메인별 폴더를 두고, 각 폴더 안에서 `api.ts`, `service.ts`, `types.ts`로 역할을 분리한다.

```tsx
src/
  services/
    auction/
      api.ts
      service.ts
      types.ts
    product/
      api.ts
      service.ts
      types.ts
    auth/
      api.ts
      service.ts
      types.ts
```

이 구조의 핵심은 화면 레이어가 HTTP 요청의 상세 구현을 직접 알지 않도록 하는 것이다.
페이지나 컴포넌트는 가능한 한 `service.ts`만 사용하고, API 호출 방식과 응답 구조 대응은 서비스 레이어 안에서 처리한다.

---

## 파일별 역할

### `types.ts`

해당 도메인에서 사용하는 요청값, 응답값, 화면용 타입을 정의한다.

- 프론트 전체에서 타입을 재사용할 수 있게 한다.
- 백엔드 요청/응답 스펙을 명확히 관리한다.
- 화면 전용 가공 타입이 필요하면 함께 둘 수 있다.

### `api.ts`

백엔드 API를 직접 호출하는 파일이다.

- `fetch`, 공통 `apiClient` 등을 이용해 HTTP 요청만 담당한다.
- 비즈니스 판단은 넣지 않는다.
- "어디로 어떤 요청을 보내는가"만 다룬다.

### `service.ts`

페이지나 컴포넌트가 직접 사용하는 함수들을 모아두는 파일이다.

- `api.ts`를 호출한다.
- 필요한 데이터 가공을 수행한다.
- 에러 메시지를 화면 친화적으로 변환할 수 있다.
- 여러 API를 조합하는 로직을 담을 수 있다.

즉, 화면 입장에서는 `service.ts`만 알면 되게 만드는 역할이다.

---

## 예시: 경매 상품 등록

### `types.ts`

도메인에서 사용하는 요청/응답 타입을 정의한다.

```tsx
// src/services/auction/types.ts
export interface CreateAuctionRequest {
  productId: number;
  startPrice: number;
  bidUnit: number;
  startsAt: string;
  endsAt: string;
}

export interface CreateAuctionResponse {
  auctionId: number;
  status: "PENDING" | "LIVE" | "CLOSED";
}
```

### `api.ts`

실제 HTTP 요청을 수행하고, 백엔드 응답을 반환한다.

```tsx
import { apiClient } from "@/lib/apiClient";

import { CreateAuctionRequest, CreateAuctionResponse } from "./types";

export async function postAuction(
  payload: CreateAuctionRequest,
): Promise<CreateAuctionResponse> {
  const { data } = await apiClient.post("/api/auctions", payload);
  return data;
}
```

### `service.ts`

페이지나 컴포넌트가 직접 사용하는 함수다.

```tsx
import * as auctionApi from "./api";
import { CreateAuctionRequest } from "./types";

export async function registerAuction(request: CreateAuctionRequest) {
  return auctionApi.postAuction(request);
}
```


---

## 페이지에서의 사용 흐름

경매 등록 페이지를 기준으로 하면 흐름은 다음과 같다.

```tsx
page.tsx -> 사용자 액션 발생 -> service.ts 함수 호출
service.ts -> 필요한 검증/가공 수행 -> api.ts 호출
api.ts -> 백엔드에 HTTP 요청 -> 응답 데이터 반환
types.ts -> 요청/응답 데이터 타입 제공
service.ts -> 필요하면 응답 데이터를 화면에 맞게 가공 -> 최종 결과 반환
page.tsx -> 반환값으로 상태 업데이트 -> UI 렌더링
```

정리하면, 화면은 사용자 인터랙션과 상태 관리에 집중하고, 데이터 통신과 비즈니스 조합은 서비스 레이어에서 흡수한다.

---

## 왜 이 구조를 쓰는가

- `page.tsx`가 너무 무거워지는 것을 막을 수 있다.
- API 경로가 바뀌어도 `api.ts`만 수정하면 된다.
- 응답 구조가 일부 달라져도 `service.ts`에서 흡수할 수 있다.
- 팀원별로 도메인 단위 분업이 쉬워진다.
- 테스트 시 `service.ts` 기준으로 검증하기 좋다.

---

## 팀 작업 기준 제안

- 페이지나 컴포넌트에서 직접 HTTP 요청을 보내지 않는다.
- 도메인 관련 타입은 우선 해당 도메인의 `types.ts`에 둔다.
- 단순 API 호출은 `api.ts`에 둔다.
- 데이터 가공, 검증, 에러 변환, API 조합은 `service.ts`에 둔다.
- 화면 레이어는 가능한 한 `service.ts`를 통해서만 데이터를 가져온다.

이 기준을 지키면 기능이 늘어나더라도 구조가 무너지지 않고, 
유지보수성과 협업 효율을 함께 확보할 수 있다.
