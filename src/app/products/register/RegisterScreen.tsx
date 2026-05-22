"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import RegisterScreenView from "./index";
import {
  calculateBidUnit,
  createDefaultAuctionForm,
  createDraft,
  formatAuctionSchedule,
  formatDisplayPrice,
  getAuctionFieldContent,
  sanitizeNumericInput,
  updateAuctionDuration,
} from "@/services/auction/register/service";
import type {
  AuctionFormValues,
  AuctionRegisterDraft,
  ProductCategory,
  ProductImagePayload,
  SaleType,
} from "@/services/auction/register/types";
import { getLocationDisplayName } from "@/services/location/service";
import { fetchMyLocationForm } from "@/services/mypage/service";

export interface RegisterScreenProps {
  onBack?: () => void;
  onComplete?: (result?: unknown) => void;
  themeColor?: string;
  mode?: SaleType;
  initialData?: any;
  submitMode?: "create" | "edit";
  getCategories: () => Promise<ProductCategory[]>;
  servicesByType: Record<SaleType, RegisterScreenServices>;
}

export interface RegisterScreenServices {
  getCategories: () => Promise<ProductCategory[]>;
  uploadImage: (file: File, sortOrder: number) => Promise<ProductImagePayload>;
  deleteImage: (imageId: number) => Promise<unknown>;
  saveDraft: (draft: AuctionRegisterDraft) => Promise<unknown>;
  update?: (
    draft: AuctionRegisterDraft,
    initialData: NonNullable<RegisterScreenProps["initialData"]>,
  ) => Promise<unknown>;
  recommendPrice: (draft: {
    name: string;
    description: string;
    saleType: SaleType;
  }) => Promise<{
    recommendedPrice: number;
    startPrice?: number | null;
  }>;
  recommendCategory: (draft: {
    name: string;
    description: string;
    images: ProductImagePayload[];
    topCategoryId: number;
  }) => Promise<{
    categoryId: number;
    categoryPathIds?: number[];
  }>;
  register: (draft: AuctionRegisterDraft) => Promise<unknown>;
}

const MAX_PRICE_DIGITS = 13;
const MAX_PRICE_VALUE = 9_999_999_999_999;

function normalizeInitialImages(initialData: any): ProductImagePayload[] {
  if (!initialData) {
    return [];
  }

  const rawImages = Array.isArray(initialData.images)
    ? initialData.images
    : Array.isArray(initialData.imageUrls)
      ? initialData.imageUrls
      : initialData.img
        ? [initialData]
        : [];

  return rawImages
    .map((image: any, index: number) => {
      if (typeof image === "string") {
        return {
          imageId: 0,
          imageUrl: image,
          sortOrder: index + 1,
        };
      }

      const imageId =
        image.imageId ??
        image.id ??
        image.imgId ??
        image.productImageId ??
        initialData.imageId ??
        initialData.imgId ??
        initialData.productImageId ??
        0;

      const imageUrl =
        image.imageUrl ?? image.url ?? image.img ?? initialData.img ?? "";

      if (!imageUrl) {
        return null;
      }

      return {
        imageId,
        imageUrl,
        sortOrder: image.sortOrder ?? index + 1,
      };
    })
    .filter(
      (image: ProductImagePayload | null): image is ProductImagePayload =>
        image !== null,
    );
}

interface SelectedCategoryPath {
  primary: ProductCategory;
  secondary: ProductCategory;
  tertiary: ProductCategory;
}

function findCategoryPathByLeafId(
  categories: ProductCategory[],
  leafCategoryId: number,
): SelectedCategoryPath | null {
  for (const primary of categories) {
    for (const secondary of primary.children) {
      for (const tertiary of secondary.children) {
        if (tertiary.id === leafCategoryId && tertiary.depth === 3) {
          return {
            primary,
            secondary,
            tertiary,
          };
        }
      }
    }
  }

  return null;
}

export default function RegisterScreen({
  onBack,
  onComplete,
  mode = "regular",
  initialData,
  submitMode,
  getCategories,
  servicesByType,
}: RegisterScreenProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showLoadDraftModal, setShowLoadDraftModal] = useState(false);
  const [saleType, setSaleType] = useState<SaleType>(initialData?.type || mode);
  const [name, setName] = useState(initialData?.name || "");
  const [pendingCategoryId, setPendingCategoryId] = useState<number | null>(
    initialData?.categoryId ?? null,
  );
  const initialPriceValue = initialData?.price
    ? initialData.price.replace(/[^0-9]/g, "")
    : initialData?.startPrice != null
      ? String(initialData.startPrice).replace(/[^0-9]/g, "")
      : "";
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedPrimaryCategoryId, setSelectedPrimaryCategoryId] = useState<
    number | null
  >(null);
  const [selectedSecondaryCategoryId, setSelectedSecondaryCategoryId] =
    useState<number | null>(null);
  const [selectedTertiaryCategoryId, setSelectedTertiaryCategoryId] = useState<
    number | null
  >(null);
  const [price, setPrice] = useState(initialPriceValue);
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [images, setImages] = useState<ProductImagePayload[]>(
    normalizeInitialImages(initialData),
  );
  const [auction, setAuction] = useState<AuctionFormValues>(() => {
    const defaultAuction = createDefaultAuctionForm();
    const durationDays =
      initialData?.auction?.durationDays ??
      initialData?.auctionDurationDays ??
      defaultAuction.durationDays;

    return {
      ...defaultAuction,
      ...initialData?.auction,
      startPrice: initialPriceValue,
      bidUnit: initialData?.auction?.bidUnit ?? calculateBidUnit(initialPriceValue),
      durationDays,
    };
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deletingImageIds, setDeletingImageIds] = useState<number[]>([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecommendingCategory, setIsRecommendingCategory] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(
    null,
  );
  const [showCategoryError, setShowCategoryError] = useState(false);
  const hasLoadedDraftRef = useRef(false);

  const themeColor = saleType === "regular" ? "#98E446" : "#F64257";
  const isEditMode = submitMode ? submitMode === "edit" : !!initialData;
  const isPrefillCreateMode = submitMode === "create" && !!initialData;
  const auctionFieldContent = getAuctionFieldContent(saleType);
  const handleBack = onBack ?? (() => router.back());
  const handleComplete = onComplete ?? (() => router.push("/"));
  const selectedPrimaryCategory =
    categories.find((category) => category.id === selectedPrimaryCategoryId) ??
    null;
  const secondaryCategories = selectedPrimaryCategory?.children ?? [];
  const selectedSecondaryCategory =
    secondaryCategories.find(
      (category) => category.id === selectedSecondaryCategoryId,
    ) ?? null;
  const tertiaryCategories = selectedSecondaryCategory?.children ?? [];
  const selectedTertiaryCategory =
    tertiaryCategories.find(
      (category) => category.id === selectedTertiaryCategoryId,
    ) ?? null;
  const categoryId = selectedTertiaryCategory?.id ?? null;
  const categoryName = [
    selectedPrimaryCategory?.nameKo,
    selectedSecondaryCategory?.nameKo,
    selectedTertiaryCategory?.nameKo,
  ]
    .filter(Boolean)
    .join(" > ");
  const isCategorySelectionComplete = !!selectedTertiaryCategory;
  const shouldShowCategoryError =
    showCategoryError &&
    (!isCategorySelectionComplete || !!categoryLoadError || isLoadingCategories);

  const getEffectiveImages = () => {
    if (images.length > 0) {
      return images;
    }

    return isEditMode ? normalizeInitialImages(initialData) : images;
  };

  const showErrorMessage = (message: string) => {
    if (typeof window !== "undefined") {
      window.alert(message);
    }
  };
  const currentServices = servicesByType[saleType];

  useEffect(() => {
    if (!isEditMode && !isPrefillCreateMode) {
      const savedDraft = localStorage.getItem("product_draft");
      if (savedDraft) {
        setShowLoadDraftModal(true);
      }
    }
  }, [isEditMode, isPrefillCreateMode]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    let isMounted = true;

    fetchMyLocationForm()
      .then((locationForm) => {
        if (!isMounted || hasLoadedDraftRef.current || location) {
          return;
        }

        setLocation(getLocationDisplayName(locationForm));
      })
      .catch((error) => {
        console.error("Failed to fetch my location", error);
      });

    return () => {
      isMounted = false;
    };
  }, [isEditMode, location]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryLoadError(null);

      try {
        const fetchedCategories = await getCategories();
        if (!isMounted) {
          return;
        }

        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch auction categories", error);
        if (isMounted) {
          setCategoryLoadError(
            "카테고리 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, [getCategories]);

  useEffect(() => {
    if (categories.length === 0 || !pendingCategoryId) {
      return;
    }

    const matchedPath = findCategoryPathByLeafId(categories, pendingCategoryId);

    if (!matchedPath) {
      setPendingCategoryId(null);
      return;
    }

    setSelectedPrimaryCategoryId(matchedPath.primary.id);
    setSelectedSecondaryCategoryId(matchedPath.secondary.id);
    setSelectedTertiaryCategoryId(matchedPath.tertiary.id);
    setPendingCategoryId(null);
    setShowCategoryError(false);
  }, [categories, pendingCategoryId]);

  const buildDraft = () =>
    createDraft({
      saleType,
      name,
      categoryName,
      price,
      startPrice: price,
      description,
      images: getEffectiveImages(),
      categoryId,
      allowOffer: false,
      location,
      draftId: null,
      auction: {
        ...auction,
        startPrice: price,
      },
    });

  const handleSaveDraft = async () => {
    const draft = buildDraft();
    setIsSavingDraft(true);

    try {
      await currentServices.saveDraft(draft);
      localStorage.setItem("product_draft", JSON.stringify(draft));
      setShowDraftModal(false);
      handleBack();
    } catch (error) {
      console.error("Failed to save draft", error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleRegister = async () => {
    setShowCategoryError(true);

    if (!name.trim()) {
      showErrorMessage("상품명을 입력해 주세요.");
      return;
    }

    if (isLoadingCategories) {
      showErrorMessage("카테고리 목록을 불러오는 중입니다. 잠시만 기다려 주세요.");
      return;
    }

    if (categoryLoadError) {
      showErrorMessage(categoryLoadError);
      return;
    }

    if (!categoryId) {
      showErrorMessage("3차 카테고리까지 모두 선택해 주세요.");
      return;
    }

    if (!price) {
      showErrorMessage(
        saleType === "auction"
          ? "시작가를 입력해 주세요."
          : "판매가를 입력해 주세요.",
      );
      return;
    }

    if (Number(price) > MAX_PRICE_VALUE) {
      showErrorMessage("가격은 9,999,999,999,999원 이하로 입력해 주세요.");
      return;
    }

    if (!description.trim()) {
      showErrorMessage("상품 설명을 입력해 주세요.");
      return;
    }

    if (!location.trim()) {
      showErrorMessage("거래 위치를 설정해 주세요.");
      return;
    }

    if (getEffectiveImages().length === 0) {
      showErrorMessage("상품 이미지를 1장 이상 등록해 주세요.");
      return;
    }

    const draft = buildDraft();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        if (!currentServices.update) {
          showErrorMessage("상품 수정 기능을 사용할 수 없습니다.");
          return;
        }

        const result = await currentServices.update(draft, initialData);
        localStorage.removeItem("product_draft");
        handleComplete(result);
        return;
      } else {
        const result = await currentServices.register(draft);
        localStorage.removeItem("product_draft");
        handleComplete(result);
        return;
      }
    } catch (error) {
      console.error("Failed to submit product", error);
      showErrorMessage(
        isEditMode
          ? "상품 수정에 실패했습니다. 입력값과 서버 상태를 확인해 주세요."
          : "상품 등록에 실패했습니다. 입력값과 서버 상태를 확인해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedImage = await currentServices.uploadImage(file, images.length + 1);
      setImages((currentImages) => [...currentImages, uploadedImage]);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleRecommendPrice = async () => {
    try {
      const recommendation = await currentServices.recommendPrice({
        name,
        description,
        saleType,
      });

      const recommendedValue =
        saleType === "auction"
          ? String(recommendation.startPrice ?? recommendation.recommendedPrice)
          : String(recommendation.recommendedPrice);

      handlePriceChange(recommendedValue);
    } catch (error) {
      console.error("Failed to recommend price", error);
    }
  };

  const handleRecommendCategory = async () => {
    if (!selectedPrimaryCategoryId) {
      showErrorMessage("대분류를 먼저 선택해 주세요.");
      return;
    }

    if (!name.trim()) {
      showErrorMessage("상품명을 입력해 주세요.");
      return;
    }

    if (!description.trim()) {
      showErrorMessage("상품 설명을 입력해 주세요.");
      return;
    }

    setIsRecommendingCategory(true);
    try {
      const recommendation = await currentServices.recommendCategory({
        name,
        description,
        images: getEffectiveImages(),
        topCategoryId: selectedPrimaryCategoryId,
      });
      const recommendedLeafCategoryId =
        recommendation.categoryPathIds?.at(-1) ?? recommendation.categoryId;
      const matchedPath = findCategoryPathByLeafId(
        categories,
        recommendedLeafCategoryId,
      );

      if (!matchedPath) {
        showErrorMessage("추천된 카테고리를 현재 목록에서 찾지 못했습니다.");
        return;
      }

      setSelectedPrimaryCategoryId(matchedPath.primary.id);
      setSelectedSecondaryCategoryId(matchedPath.secondary.id);
      setSelectedTertiaryCategoryId(matchedPath.tertiary.id);
      setPendingCategoryId(null);
      setShowCategoryError(false);
    } catch (error) {
      console.error("Failed to recommend category", error);
      showErrorMessage("카테고리 추천에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsRecommendingCategory(false);
    }
  };

  const handleLoadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("product_draft");
      if (savedDraft) {
        const draft = createDraft(JSON.parse(savedDraft));
        hasLoadedDraftRef.current = true;
        setSaleType(draft.saleType || mode);
        setName(draft.name);
        setPendingCategoryId(draft.categoryId);
        setSelectedPrimaryCategoryId(null);
        setSelectedSecondaryCategoryId(null);
        setSelectedTertiaryCategoryId(null);
        setShowCategoryError(false);
        setPrice(draft.price);
        setDescription(draft.description);
        setLocation(draft.location);
        setImages(draft.images);
        setAuction(draft.auction);
      }
    } catch (error) {
      console.error("Failed to load draft", error);
    }
    setShowLoadDraftModal(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("product_draft");
    setShowLoadDraftModal(false);
  };

  const handleRemoveImage = async (targetSortOrder: number) => {
    const targetImage = images.find(
      (image) => image.sortOrder === targetSortOrder,
    );

    if (!targetImage) {
      return;
    }

    if (targetImage.imageId > 0 && !isEditMode && !isPrefillCreateMode) {
      setDeletingImageIds((currentIds) => [...currentIds, targetImage.imageId]);

      try {
        await currentServices.deleteImage(targetImage.imageId);
      } catch (error) {
        console.error("Failed to delete image", error);
        setDeletingImageIds((currentIds) =>
          currentIds.filter((imageId) => imageId !== targetImage.imageId),
        );
        return;
      }
    }

    setImages((currentImages) =>
      currentImages
        .filter((image) => image.sortOrder !== targetSortOrder)
        .map((image, index) => ({
          ...image,
          sortOrder: index + 1,
        })),
    );

    if (targetImage.imageId > 0 && !isEditMode && !isPrefillCreateMode) {
      setDeletingImageIds((currentIds) =>
        currentIds.filter((imageId) => imageId !== targetImage.imageId),
      );
    }
  };

  const handleSaleTypeChange = (nextSaleType: SaleType) => {
    if (isEditMode) {
      return;
    }

    setSaleType(nextSaleType);
    if (nextSaleType === "auction") {
      setAuction((currentAuction) => ({
        ...currentAuction,
        startPrice: price,
        bidUnit: calculateBidUnit(price),
      }));
    }
  };

  const handlePrimaryCategoryChange = (value: string) => {
    const nextCategoryId = value ? Number(value) : null;
    setSelectedPrimaryCategoryId(nextCategoryId);
    setSelectedSecondaryCategoryId(null);
    setSelectedTertiaryCategoryId(null);
    setPendingCategoryId(null);
    setShowCategoryError(false);
  };

  const handleSecondaryCategoryChange = (value: string) => {
    const nextCategoryId = value ? Number(value) : null;
    setSelectedSecondaryCategoryId(nextCategoryId);
    setSelectedTertiaryCategoryId(null);
    setPendingCategoryId(null);
    setShowCategoryError(false);
  };

  const handleTertiaryCategoryChange = (value: string) => {
    setSelectedTertiaryCategoryId(value ? Number(value) : null);
    setPendingCategoryId(null);
    setShowCategoryError(false);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = sanitizeNumericInput(value).slice(0, MAX_PRICE_DIGITS);
    setPrice(numericValue);

    if (saleType === "auction") {
      setAuction((currentAuction) => ({
        ...currentAuction,
        startPrice: numericValue,
        bidUnit: calculateBidUnit(numericValue),
      }));
    }
  };

  const handleAuctionDurationChange = (value: string) => {
    const nextDuration = Number(value);
    setAuction((currentAuction) =>
      updateAuctionDuration(currentAuction, nextDuration),
    );
  };

  return (
    <RegisterScreenView
      fileInputRef={fileInputRef}
      showDraftModal={showDraftModal}
      showLoadDraftModal={showLoadDraftModal}
      saleType={saleType}
      name={name}
      categories={categories}
      selectedPrimaryCategoryId={selectedPrimaryCategoryId}
      selectedSecondaryCategoryId={selectedSecondaryCategoryId}
      selectedTertiaryCategoryId={selectedTertiaryCategoryId}
      categoryName={categoryName}
      price={price}
      description={description}
      images={images}
      auction={auction}
      isEditMode={isEditMode}
      themeColor={themeColor}
      auctionFieldContent={auctionFieldContent}
      isUploadingImage={isUploadingImage}
      deletingImageIds={deletingImageIds}
      isSavingDraft={isSavingDraft}
      isSubmitting={isSubmitting}
      isRecommendingCategory={isRecommendingCategory}
      isLoadingCategories={isLoadingCategories}
      categoryLoadError={categoryLoadError}
      showCategoryError={shouldShowCategoryError}
      onBack={handleBack}
      onOpenDraftModal={() => setShowDraftModal(true)}
      onCloseDraftModal={() => setShowDraftModal(false)}
      onCloseLoadDraftModal={() => setShowLoadDraftModal(false)}
      onNameChange={setName}
      onPrimaryCategoryChange={handlePrimaryCategoryChange}
      onSecondaryCategoryChange={handleSecondaryCategoryChange}
      onTertiaryCategoryChange={handleTertiaryCategoryChange}
      onDescriptionChange={setDescription}
      onSaleTypeChange={handleSaleTypeChange}
      onPriceChange={handlePriceChange}
      onAuctionDurationChange={handleAuctionDurationChange}
      onImageButtonClick={handleImageButtonClick}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      onRecommendCategory={handleRecommendCategory}
      onRecommendPrice={handleRecommendPrice}
      onSaveDraft={handleSaveDraft}
      onDiscardDraft={handleDiscardDraft}
      onLoadDraft={handleLoadDraft}
      onRegister={handleRegister}
      isRegisterDisabled={
        isSubmitting ||
        isLoadingCategories ||
        !!categoryLoadError ||
        !isCategorySelectionComplete
      }
      formatDisplayPrice={formatDisplayPrice}
      formatAuctionSchedule={formatAuctionSchedule}
    />
  );
}
