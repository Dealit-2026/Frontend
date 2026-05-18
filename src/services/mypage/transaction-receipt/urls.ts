export const PURCHASE_RECEIPT_URL = (purchaseId: number) =>
  `/api/v1/mypage/purchases/${purchaseId}/receipt`;
// Backend currently exposes receipt via purchases endpoint for both purchase/sale contexts.
export const SALES_RECEIPT_URL = (saleId: number) =>
  `/api/v1/mypage/purchases/${saleId}/receipt`;
