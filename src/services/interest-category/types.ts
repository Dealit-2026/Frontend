export interface InterestCategoryOptionResponse {
  categoryId: number;
  nameKo: string;
  nameEn: string;
}

export interface UpdateMyInterestCategoriesRequest {
  interestCategoryIds: number[];
}

export interface InterestCategoryOptionViewModel {
  categoryId: number;
  name: string;
  icon: string;
  fromApi: boolean;
}
