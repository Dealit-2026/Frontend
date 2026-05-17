import * as productSearchApi from "@/services/product/search/api";
import type { AuctionListItemViewModel } from "@/services/auction/list/types";
import type {
  PopularSearchKeywordViewModel,
  ProductSearchItemResponse,
  ProductSearchItemViewModel,
  SearchCategoryViewModel,
  SearchCategoryOptionResponse,
  UnifiedSearchItemResponse,
} from "@/services/product/search/types";

const DEFAULT_CATEGORY_LABEL = "카테고리 없음";
const DEFAULT_LOCATION_LABEL = "지역 정보 없음";
const FALLBACK_CATEGORIES: SearchCategoryViewModel[] = [
  { categoryId: -1, name: "디지털기기", icon: "💻", enabled: false, fromApi: false },
  { categoryId: -2, name: "생활가전", icon: "🔌", enabled: false, fromApi: false },
  { categoryId: -3, name: "가구/인테리어", icon: "🛋️", enabled: false, fromApi: false },
  { categoryId: -4, name: "유아동", icon: "🧸", enabled: false, fromApi: false },
  { categoryId: -5, name: "생활/가공식품", icon: "🥫", enabled: false, fromApi: false },
  { categoryId: -6, name: "유아도서", icon: "📚", enabled: false, fromApi: false },
  { categoryId: -7, name: "스포츠/레저", icon: "⚽", enabled: false, fromApi: false },
  { categoryId: -8, name: "여성잡화", icon: "👜", enabled: false, fromApi: false },
  { categoryId: -9, name: "여성의류", icon: "👗", enabled: false, fromApi: false },
  { categoryId: -10, name: "남성패션/잡화", icon: "👕", enabled: false, fromApi: false },
  { categoryId: -11, name: "게임/취미", icon: "🎮", enabled: false, fromApi: false },
  { categoryId: -12, name: "뷰티/미용", icon: "💄", enabled: false, fromApi: false },
  { categoryId: -13, name: "반려동물용품", icon: "🐾", enabled: false, fromApi: false },
  { categoryId: -14, name: "도서/티켓/음반", icon: "📚", enabled: false, fromApi: false },
  { categoryId: -15, name: "식물", icon: "🌿", enabled: false, fromApi: false },
  { categoryId: -16, name: "기타", icon: "✨", enabled: false, fromApi: false },
];

const CATEGORY_ICON_RULES = [
  { keywords: ["전자", "디지털"], icon: "💻" },
  { keywords: ["의류"], icon: "👗" },
  { keywords: ["도서"], icon: "📚" },
];

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString()}원`;
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, "");
}

function getIcon(name: string) {
  const normalizedName = normalizeName(name);
  const matchedRule = CATEGORY_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  if (matchedRule) {
    return matchedRule.icon;
  }

  const matchedFallback = FALLBACK_CATEGORIES.find(
    (category) => normalizeName(category.name) === normalizedName,
  );

  return matchedFallback?.icon ?? "✨";
}

function toSearchCategoryViewModel(
  category: SearchCategoryOptionResponse,
): SearchCategoryViewModel {
  return {
    categoryId: category.id,
    name: category.nameKo,
    icon: getIcon(category.nameKo),
    enabled: true,
    fromApi: true,
  };
}

function toProductSearchItemViewModel(
  item: ProductSearchItemResponse,
): ProductSearchItemViewModel {
  return {
    saleType: "REGULAR",
    auctionId: null,
    productId: item.productId,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(item.price),
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    categoryId: item.categoryId,
    categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
    viewCount: item.viewCount,
    favoriteCount: item.favoriteCount,
    createdAt: item.createdAt,
  };
}

function getLastCategoryName(names: string[] | null | undefined) {
  return names && names.length > 0
    ? names[names.length - 1]
    : DEFAULT_CATEGORY_LABEL;
}

function toUnifiedSearchItemViewModel(
  item: UnifiedSearchItemResponse,
): ProductSearchItemViewModel {
  const isAuction = item.type === "AUCTION";
  const price = isAuction ? item.currentPrice : item.price;

  return {
    saleType: item.type,
    auctionId: item.auctionId,
    productId: item.productId,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl,
    priceLabel: formatPrice(price ?? 0),
    currentPriceLabel: isAuction ? formatPrice(price ?? 0) : undefined,
    location: item.location ?? DEFAULT_LOCATION_LABEL,
    categoryId: item.categoryId,
    categoryName: getLastCategoryName(item.categoryNames),
    viewCount: item.viewCount,
    favoriteCount: item.favoriteCount,
    createdAt: item.createdAt,
    endAtLabel: item.endsAt ? formatEndAt(item.endsAt) : undefined,
    auctionStatusLabel: isAuction
      ? formatAuctionStatus(
          (item.auctionStatus ?? "DRAFT") as AuctionListItemViewModel["auctionStatus"],
        )
      : undefined,
  };
}

export async function fetchSearchCategoryOptions(): Promise<
  SearchCategoryViewModel[]
> {
  return fetchSearchCategoryOptionsByMode("regular");
}

export async function fetchSearchCategoryOptionsByMode(
  mode: "regular" | "auction",
): Promise<SearchCategoryViewModel[]> {
  const apiCategories =
    mode === "auction"
      ? await productSearchApi.getAuctionSearchCategories()
      : await productSearchApi.getSearchCategories();
  const apiViewModels = apiCategories
    .filter((category) => category.depth === 1)
    .map(toSearchCategoryViewModel);
  const apiNameSet = new Set(
    apiViewModels.map((category) => normalizeName(category.name)),
  );
  const missingFallbacks = FALLBACK_CATEGORIES.filter(
    (category) => !apiNameSet.has(normalizeName(category.name)),
  );

  return [...apiViewModels, ...missingFallbacks];
}

export async function fetchProductsByCategory(
  categoryId: number,
  page = 0,
  size = 20,
): Promise<ProductSearchItemViewModel[]> {
  const response = await productSearchApi.searchProductsByCategory({
    categoryId,
    page,
    size,
  });
  return response.content.map(toProductSearchItemViewModel);
}

export async function fetchIntegratedSearchResults({
  keyword,
  categoryId,
  page = 0,
  size = 20,
}: {
  keyword?: string | null;
  categoryId?: number | null;
  page?: number;
  size?: number;
}): Promise<ProductSearchItemViewModel[]> {
  const response = await productSearchApi.searchIntegrated({
    keyword,
    categoryId,
    page,
    size,
  });

  return response.content.map(toUnifiedSearchItemViewModel);
}

export async function fetchPopularSearchKeywords(
  size = 10,
): Promise<PopularSearchKeywordViewModel[]> {
  const response = await productSearchApi.getPopularSearchKeywords(size);

  return response.content.map((item, index) => ({
    rank: index + 1,
    keyword: item.keyword,
    count: item.count,
    hot: index < 3,
  }));
}

function formatAuctionStatus(status: AuctionListItemViewModel["auctionStatus"]) {
  switch (status) {
    case "ONGOING":
      return "진행중";
    case "ENDED":
      return "종료";
    case "NO_BID":
      return "유찰";
    case "SUCCESSFUL_BID":
      return "낙찰";
    case "DRAFT":
    default:
      return "준비중";
  }
}

function formatEndAt(endAt: string) {
  const endTime = new Date(endAt).getTime();
  if (!Number.isFinite(endTime)) {
    return "마감 시간 없음";
  }

  const diffMs = endTime - Date.now();
  if (diffMs <= 0) {
    return "마감";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }
  return `${Math.max(1, minutes)}분 남음`;
}

export async function fetchAuctionsByCategory(
  categoryId: number,
  page = 0,
  size = 20,
): Promise<AuctionListItemViewModel[]> {
  const response = await productSearchApi.searchAuctionsByCategory({
    categoryId,
    page,
    size,
  });

  return response.content.map((item) => {
    const currentPriceLabel = formatPrice(item.currentPrice);
    return {
      productId: item.productId,
      auctionId: item.auctionId,
      name: item.title,
      thumbnailUrl: item.thumbnailUrl,
      priceLabel: currentPriceLabel,
      startPriceLabel: formatPrice(item.startPrice),
      currentPriceLabel,
      location: item.location ?? DEFAULT_LOCATION_LABEL,
      categoryName: item.categoryName ?? DEFAULT_CATEGORY_LABEL,
      bidCount: item.bidCount,
      endAt: item.endAt,
      endAtLabel: formatEndAt(item.endAt),
      auctionStatus: item.auctionStatus,
      auctionStatusLabel: formatAuctionStatus(item.auctionStatus),
      popularScore: item.popularScore,
      createdAt: item.createdAt,
    };
  });
}
