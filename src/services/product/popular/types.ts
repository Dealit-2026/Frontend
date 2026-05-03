export interface PopularProductItemResponse {
  productId: number;
  name: string;
  thumbnailUrl: string | null;
  price: number;
  location: string | null;
  categoryName: string | null;
  viewCount: number;
  createdAt: string;
  popularScore: number;
}

export interface PopularProductListResponse {
  content: PopularProductItemResponse[];
}

export interface PopularProductItemViewModel {
  productId: number;
  name: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  location: string;
  categoryName: string;
  viewCount: number;
  popularScore: number;
}
