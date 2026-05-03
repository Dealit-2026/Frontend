export interface HotListProductItemResponse {
  productId: number;
  name: string;
  thumbnailUrl?: string | null;
  price: number;
  location?: string | null;
  categoryName?: string | null;
  viewCount: number;
  favoriteCount: number;
  chatCount?: number;
  hotScore: number;
  rank: number;
  createdAt: string;
}

export interface HotListProductListResponse {
  content: HotListProductItemResponse[];
}
