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
  name: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  location: string;
  categoryId: number;
  categoryName: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
}

export interface SearchCategoryViewModel {
  categoryId: number;
  name: string;
  icon: string;
  enabled: boolean;
  fromApi: boolean;
}
