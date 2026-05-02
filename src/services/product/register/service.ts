import * as regularProductApi from "@/services/product/register/api";
import type {
  RecommendRegularProductCategoryRequest,
  RecommendRegularProductPriceRequest,
  RegularProductCategory,
  RegularProductCreateRequest,
  RegularProductImagePayload,
  RegularProductRegisterDraft,
  SaveRegularProductDraftRequest,
  UploadRegularProductImageResponse,
} from "@/services/product/register/types";

export function createDefaultRegularProductForm(): RegularProductRegisterDraft {
  return {
    name: "",
    description: "",
    categoryId: null,
    categoryName: "",
    price: "",
    allowOffer: false,
    location: "",
    draftId: null,
    images: [],
  };
}

export function createRegularProductDraft(
  draft: Partial<RegularProductRegisterDraft>,
): RegularProductRegisterDraft {
  return {
    ...createDefaultRegularProductForm(),
    ...draft,
    categoryId: draft.categoryId ?? null,
    draftId: draft.draftId ?? null,
    images: (draft.images ?? []) as RegularProductImagePayload[],
  };
}

export function formatDisplayPrice(value: string) {
  if (!value) {
    return "";
  }

  return Number(value).toLocaleString();
}

export function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function normalizeRegularProductImagePayload(
  images: RegularProductImagePayload[],
) {
  return images.map((image, index) => ({
    imageId: image.imageId,
    imageUrl: image.imageUrl,
    sortOrder: image.sortOrder || index + 1,
  }));
}

export function toRegularProductImagePayload(
  uploadedImage: UploadRegularProductImageResponse,
  sortOrder: number,
): RegularProductImagePayload {
  return {
    imageId: uploadedImage.imageId,
    imageUrl: uploadedImage.imageUrl,
    sortOrder,
  };
}

export function buildCreateRegularProductRequest(
  draft: RegularProductRegisterDraft,
): RegularProductCreateRequest {
  return {
    name: draft.name,
    description: draft.description,
    saleType: "REGULAR",
    categoryId: draft.categoryId ?? 0,
    price: Number(draft.price || 0),
    allowOffer: draft.allowOffer,
    images: normalizeRegularProductImagePayload(draft.images),
    location: draft.location,
    draftId: draft.draftId,
  };
}

export function buildSaveRegularProductDraftRequest(
  draft: RegularProductRegisterDraft,
): SaveRegularProductDraftRequest {
  return {
    ...buildCreateRegularProductRequest(draft),
    price: draft.price ? Number(draft.price) : null,
  };
}

export function buildRecommendRegularProductCategoryRequest(
  draft: Pick<RegularProductRegisterDraft, "name" | "description">,
): RecommendRegularProductCategoryRequest {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
  };
}

export function buildRecommendRegularProductPriceRequest(
  draft: Pick<RegularProductRegisterDraft, "name" | "description">,
): RecommendRegularProductPriceRequest {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    saleType: "REGULAR",
  };
}

export async function uploadRegularProductImage(file: File, sortOrder: number) {
  const uploadedImage = await regularProductApi.uploadRegularProductImage(file);
  return toRegularProductImagePayload(uploadedImage, sortOrder);
}

export async function getRegularProductCategories(): Promise<
  RegularProductCategory[]
> {
  return regularProductApi.getRegularProductCategories();
}

export async function deleteRegularProductImage(imageId: number) {
  return regularProductApi.deleteRegularProductImage(imageId);
}

export async function saveRegularProductDraft(
  draft: RegularProductRegisterDraft,
) {
  return regularProductApi.saveRegularProductDraft(
    buildSaveRegularProductDraftRequest(draft),
  );
}

export async function recommendRegularProductCategory(
  draft: Pick<RegularProductRegisterDraft, "name" | "description">,
) {
  return regularProductApi.recommendRegularProductCategory(
    buildRecommendRegularProductCategoryRequest(draft),
  );
}

export async function recommendRegularProductPrice(
  draft: Pick<RegularProductRegisterDraft, "name" | "description">,
) {
  return regularProductApi.recommendRegularProductPrice(
    buildRecommendRegularProductPriceRequest(draft),
  );
}

export async function registerRegularProduct(draft: RegularProductRegisterDraft) {
  return regularProductApi.postRegularProduct(
    buildCreateRegularProductRequest(draft),
  );
}
