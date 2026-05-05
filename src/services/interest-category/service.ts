import * as interestCategoryApi from "@/services/interest-category/api";
import type {
  InterestCategoryOptionResponse,
  InterestCategoryOptionViewModel,
} from "@/services/interest-category/types";

const FALLBACK_CATEGORIES: InterestCategoryOptionViewModel[] = [
  {
    categoryId: -1,
    name: "\uB514\uC9C0\uD138\uAE30\uAE30",
    icon: "\uD83D\uDCBB",
    fromApi: false,
  },
  {
    categoryId: -2,
    name: "\uC0DD\uD65C\uAC00\uC804",
    icon: "\uD83D\uDD0C",
    fromApi: false,
  },
  {
    categoryId: -3,
    name: "\uAC00\uAD6C/\uC778\uD14C\uB9AC\uC5B4",
    icon: "\uD83D\uDECB\uFE0F",
    fromApi: false,
  },
  {
    categoryId: -4,
    name: "\uC720\uC544\uB3D9",
    icon: "\uD83E\uDDF8",
    fromApi: false,
  },
  {
    categoryId: -5,
    name: "\uC0DD\uD65C/\uAC00\uACF5\uC2DD\uD488",
    icon: "\uD83E\uDD6B",
    fromApi: false,
  },
  {
    categoryId: -6,
    name: "\uC720\uC544\uB3C4\uC11C",
    icon: "\uD83D\uDCDA",
    fromApi: false,
  },
  {
    categoryId: -7,
    name: "\uC2A4\uD3EC\uCE20/\uB808\uC800",
    icon: "\u26BD",
    fromApi: false,
  },
  {
    categoryId: -8,
    name: "\uC5EC\uC131\uC7A1\uD654",
    icon: "\uD83D\uDC5C",
    fromApi: false,
  },
  {
    categoryId: -9,
    name: "\uC5EC\uC131\uC758\uB958",
    icon: "\uD83D\uDC57",
    fromApi: false,
  },
  {
    categoryId: -10,
    name: "\uB0A8\uC131\uD328\uC158/\uC7A1\uD654",
    icon: "\uD83D\uDC55",
    fromApi: false,
  },
  {
    categoryId: -11,
    name: "\uAC8C\uC784/\uCDE8\uBBF8",
    icon: "\uD83C\uDFAE",
    fromApi: false,
  },
  {
    categoryId: -12,
    name: "\uBDF0\uD2F0/\uBBF8\uC6A9",
    icon: "\uD83D\uDC84",
    fromApi: false,
  },
  {
    categoryId: -13,
    name: "\uBC18\uB824\uB3D9\uBB3C\uC6A9\uD488",
    icon: "\uD83D\uDC3E",
    fromApi: false,
  },
  {
    categoryId: -14,
    name: "\uB3C4\uC11C/\uD2F0\uCF13/\uC74C\uBC18",
    icon: "\uD83D\uDCDA",
    fromApi: false,
  },
  {
    categoryId: -15,
    name: "\uC2DD\uBB3C",
    icon: "\uD83C\uDF3F",
    fromApi: false,
  },
  {
    categoryId: -16,
    name: "\uAE30\uD0C0",
    icon: "\u2728",
    fromApi: false,
  },
];

const CATEGORY_ICON_RULES = [
  { keywords: ["\uC804\uC790", "\uB514\uC9C0\uD138"], icon: "\uD83D\uDCBB" },
  { keywords: ["\uC758\uB958"], icon: "\uD83D\uDC57" },
  { keywords: ["\uB3C4\uC11C"], icon: "\uD83D\uDCDA" },
];

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

  return matchedFallback?.icon ?? "\u2728";
}

function toViewModel(
  category: InterestCategoryOptionResponse,
): InterestCategoryOptionViewModel {
  return {
    categoryId: category.categoryId,
    name: category.nameKo,
    icon: getIcon(category.nameKo),
    fromApi: true,
  };
}

export async function fetchInterestCategoryOptions(): Promise<
  InterestCategoryOptionViewModel[]
> {
  const apiCategories = await interestCategoryApi.getInterestCategories();
  const apiViewModels = apiCategories.map(toViewModel);
  const apiNameSet = new Set(
    apiViewModels.map((category) => normalizeName(category.name)),
  );
  const missingFallbacks = FALLBACK_CATEGORIES.filter(
    (category) => !apiNameSet.has(normalizeName(category.name)),
  );

  return [...apiViewModels, ...missingFallbacks];
}

export async function fetchMyInterestCategoryIds(): Promise<number[]> {
  const categories = await interestCategoryApi.getMyInterestCategories();

  return categories.map((category) => category.categoryId);
}

export async function saveMyInterestCategories(
  interestCategoryIds: number[],
): Promise<number[]> {
  const categories = await interestCategoryApi.patchMyInterestCategories({
    interestCategoryIds,
  });

  return categories.map((category) => category.categoryId);
}
