export interface Category {
  categoryId: number;
  nameKo: string;
  nameEn: string;
}

export interface Seller {
  memberId: number;
  nickname: string;
  location: string;
}

export interface GeneralSale {
  price: number;
  viewCount: number;
  favoriteCount: number;
  chatCount: number;
  status: string;
}

export interface Auction {
  auctionId: number;
  startPrice: number;
  currentPrice: number;
  minimumNextBidPrice: number;
  bidCount: number;
  viewCount: number;
  favoriteCount: number;
  chatCount: number;
  endAt: string;
  status: string;
}

export interface ProductDetailResponse {
  productId: number;
  name: string;
  description: string;
  saleType: "REGULAR" | "AUCTION";
  category: Category;
  imageUrls: string[];
  status: string;
  seller: Seller;
  createdAt: string;
  updatedAt: string;
  generalSale: GeneralSale | null;
  auction: Auction | null;
  canChat: boolean;
  canBid: boolean;
  canPurchase: boolean;
  canFavorite: boolean;
}
