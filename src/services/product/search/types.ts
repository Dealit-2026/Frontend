export interface SearchCategoryOptionResponse {
  id: number;
  nameKo: string;
  nameEn: string;
  depth: number;
  parentId: number | null;
  enabled: boolean;
  children: SearchCategoryOptionResponse[];
}

export interface ProductSearchItemResponse {
  productId: number;
  name: string;
  thumbnailUrl: string | null;
  price: number;
  location: string | null;
  categoryId: number;
  categoryName: string | null;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
}

export interface ProductSearchListResponse {
  content: ProductSearchItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface ProductSearchItemViewModel {
  productId: number;
  auctionId?: number | null;
  saleType?: "REGULAR" | "AUCTION";
  name: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  currentPriceLabel?: string;
  location: string;
  categoryId: number | null;
  categoryName: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  endAtLabel?: string;
  auctionStatusLabel?: string;
}

export interface SearchCategoryViewModel {
  categoryId: number;
  name: string;
  icon: string;
  enabled: boolean;
  fromApi: boolean;
}

export type UnifiedSearchResultType = "REGULAR" | "AUCTION";

export interface UnifiedSearchItemResponse {
  id: string;
  type: UnifiedSearchResultType;
  productId: number;
  auctionId: number | null;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  categoryId: number | null;
  categoryPathIds: number[];
  categoryNames: string[];
  price: number | null;
  currentPrice: number | null;
  location: string | null;
  productStatus: string | null;
  auctionStatus: string | null;
  endsAt: string | null;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
}

export interface UnifiedSearchListResponse {
  keyword: string | null;
  type: UnifiedSearchResultType | null;
  categoryId: number | null;
  content: UnifiedSearchItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface PopularSearchKeywordResponse {
  keyword: string;
  count: number;
}

export interface PopularSearchKeywordListResponse {
  content: PopularSearchKeywordResponse[];
  size: number;
}

export interface PopularSearchKeywordViewModel {
  rank: number;
  keyword: string;
  count: number;
  hot: boolean;
}
