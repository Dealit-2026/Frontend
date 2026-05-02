import * as productDetailApi from "./api";
import type { ProductDetailResponse } from "./types";

export async function fetchProductDetail(
  productId: number,
): Promise<ProductDetailResponse> {
  return productDetailApi.getProductDetail(productId);
}

export function isRegularProduct(product: ProductDetailResponse): boolean {
  return product.saleType === "REGULAR";
}

export function isAuctionProduct(product: ProductDetailResponse): boolean {
  return product.saleType === "AUCTION";
}

export function getProductPrice(product: ProductDetailResponse): number | null {
  if (isRegularProduct(product)) {
    return product.generalSale?.price ?? null;
  }

  return product.auction?.currentPrice ?? null;
}

export function getViewCount(product: ProductDetailResponse): number {
  if (isRegularProduct(product)) {
    return product.generalSale?.viewCount ?? 0;
  }

  return product.auction?.viewCount ?? 0;
}

export function getFavoriteCount(product: ProductDetailResponse): number {
  if (isRegularProduct(product)) {
    return product.generalSale?.favoriteCount ?? 0;
  }

  return product.auction?.favoriteCount ?? 0;
}

export function getChatCount(product: ProductDetailResponse): number {
  if (isRegularProduct(product)) {
    return product.generalSale?.chatCount ?? 0;
  }

  return product.auction?.chatCount ?? 0;
}
