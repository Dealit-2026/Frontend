"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import RegisterScreenView from "./index";
import {
  calculateBidUnit,
  createDefaultAuctionForm,
  createDraft,
  deleteAuctionImage,
  formatAuctionSchedule,
  formatDisplayPrice,
  getAuctionFieldContent,
  recommendAuctionCategory,
  recommendAuctionPrice,
  registerAuction,
  sanitizeNumericInput,
  saveAuctionDraft,
  uploadAuctionImage,
  updateAuctionDuration,
} from "@/services/auction/register/service";
import type {
  AuctionFormValues,
  ProductImagePayload,
  SaleType,
} from "@/services/auction/register/types";

export interface RegisterScreenProps {
  onBack?: () => void;
  onComplete?: () => void;
  themeColor?: string;
  mode?: SaleType;
  initialData?: any;
}

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

export default function RegisterScreen({
  onBack,
  onComplete,
  mode = "regular",
  initialData,
}: RegisterScreenProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showLoadDraftModal, setShowLoadDraftModal] = useState(false);
  const [saleType, setSaleType] = useState<SaleType>(initialData?.type || mode);
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState<number | null>(
    initialData?.categoryId ?? null,
  );
  const [categoryName, setCategoryName] = useState(initialData?.category || "");
  const [price, setPrice] = useState(
    initialData?.price ? initialData.price.replace(/[^0-9]/g, "") : "",
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [images, setImages] = useState<ProductImagePayload[]>(
    normalizeInitialImages(initialData),
  );
  const [auction, setAuction] = useState<AuctionFormValues>(
    createDefaultAuctionForm(),
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deletingImageIds, setDeletingImageIds] = useState<number[]>([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const themeColor = saleType === "regular" ? "#98E446" : "#F64257";
  const isEditMode = !!initialData;
  const auctionFieldContent = getAuctionFieldContent(saleType);
  const handleBack = onBack ?? (() => router.back());
  const handleComplete = onComplete ?? (() => router.push("/"));

  const showErrorMessage = (message: string) => {
    if (typeof window !== "undefined") {
      window.alert(message);
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      const savedDraft = localStorage.getItem("product_draft");
      if (savedDraft) {
        setShowLoadDraftModal(true);
      }
    }
  }, [isEditMode]);

  const buildDraft = () =>
    createDraft({
      saleType,
      name,
      categoryName,
      price,
      startPrice: price,
      description,
      images,
      categoryId,
      allowOffer: false,
      location: "",
      draftId: null,
      auctionEndAt: auction.endsAt,
      auction: {
        ...auction,
        startPrice: price,
      },
    });

  const handleSaveDraft = async () => {
    const draft = buildDraft();
    setIsSavingDraft(true);

    try {
      await saveAuctionDraft(draft);
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
    if (!name.trim()) {
      showErrorMessage("상품명을 입력해 주세요.");
      return;
    }

    if (!categoryId) {
      showErrorMessage(
        "카테고리 직접 입력은 아직 등록에 반영되지 않습니다. 우선 AI 추천으로 카테고리를 선택해 주세요.",
      );
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

    if (!description.trim()) {
      showErrorMessage("상품 설명을 입력해 주세요.");
      return;
    }

    if (images.length === 0) {
      showErrorMessage("상품 이미지를 1장 이상 등록해 주세요.");
      return;
    }

    const draft = buildDraft();
    setIsSubmitting(true);

    try {
      await registerAuction(draft);
      localStorage.removeItem("product_draft");
      handleComplete();
    } catch (error) {
      console.error("Failed to register auction", error);
      showErrorMessage("상품 등록에 실패했습니다. 입력값과 서버 상태를 확인해 주세요.");
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
      const uploadedImage = await uploadAuctionImage(file, images.length + 1);
      setImages((currentImages) => [...currentImages, uploadedImage]);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleRecommendCategory = async () => {
    try {
      const recommendation = await recommendAuctionCategory({
        name,
        description,
      });
      setCategoryId(recommendation.categoryId);
      setCategoryName(recommendation.categoryName);
    } catch (error) {
      console.error("Failed to recommend category", error);
    }
  };

  const handleRecommendPrice = async () => {
    try {
      const recommendation = await recommendAuctionPrice({
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

  const handleLoadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("product_draft");
      if (savedDraft) {
        const draft = createDraft(JSON.parse(savedDraft));
        setSaleType(draft.saleType || mode);
        setName(draft.name);
        setCategoryId(draft.categoryId);
        setCategoryName(draft.categoryName ?? (initialData?.category || ""));
        setPrice(draft.price);
        setDescription(draft.description);
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

    if (targetImage.imageId > 0) {
      setDeletingImageIds((currentIds) => [...currentIds, targetImage.imageId]);

      try {
        await deleteAuctionImage(targetImage.imageId);
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

    if (targetImage.imageId > 0) {
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

  const handleCategoryNameChange = (value: string) => {
    setCategoryName(value);
    setCategoryId(null);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = sanitizeNumericInput(value);
    setPrice(numericValue);

    if (saleType === "auction") {
      setAuction((currentAuction) => ({
        ...currentAuction,
        startPrice: numericValue,
        bidUnit: calculateBidUnit(numericValue),
      }));
    }
  };

  const handleAuctionStartChange = (value: string) => {
    const nextAuction = updateAuctionDuration(
      {
        ...auction,
        startsAt: value,
      },
      auction.durationDays,
    );
    setAuction(nextAuction);
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
      onBack={handleBack}
      onOpenDraftModal={() => setShowDraftModal(true)}
      onCloseDraftModal={() => setShowDraftModal(false)}
      onCloseLoadDraftModal={() => setShowLoadDraftModal(false)}
      onNameChange={setName}
      onCategoryNameChange={handleCategoryNameChange}
      onDescriptionChange={setDescription}
      onSaleTypeChange={handleSaleTypeChange}
      onPriceChange={handlePriceChange}
      onAuctionStartChange={handleAuctionStartChange}
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
      formatDisplayPrice={formatDisplayPrice}
      formatAuctionSchedule={formatAuctionSchedule}
    />
  );
}
