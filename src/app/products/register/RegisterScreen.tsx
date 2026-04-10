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
    initialData?.img
      ? [{ imageId: 0, imageUrl: initialData.img, sortOrder: 1 }]
      : [],
  );
  const [auction, setAuction] = useState<AuctionFormValues>(
    createDefaultAuctionForm(),
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const themeColor = saleType === "regular" ? "#98E446" : "#F64257";
  const isEditMode = !!initialData;
  const auctionFieldContent = getAuctionFieldContent(saleType);
  const handleBack = onBack ?? (() => router.back());
  const handleComplete = onComplete ?? (() => router.push("/"));

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
    const draft = buildDraft();
    setIsSubmitting(true);

    try {
      await registerAuction(draft);
      localStorage.removeItem("product_draft");
      handleComplete();
    } catch (error) {
      console.error("Failed to register auction", error);
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
        setCategoryName(initialData?.category || "");
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

  const handleRemoveImage = (targetSortOrder: number) => {
    setImages((currentImages) =>
      currentImages
        .filter((image) => image.sortOrder !== targetSortOrder)
        .map((image, index) => ({
          ...image,
          sortOrder: index + 1,
        })),
    );
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
      isSavingDraft={isSavingDraft}
      isSubmitting={isSubmitting}
      onBack={handleBack}
      onOpenDraftModal={() => setShowDraftModal(true)}
      onCloseDraftModal={() => setShowDraftModal(false)}
      onCloseLoadDraftModal={() => setShowLoadDraftModal(false)}
      onNameChange={setName}
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
