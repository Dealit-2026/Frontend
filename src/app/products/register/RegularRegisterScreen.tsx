"use client";

import type { ComponentProps } from "react";

import RegisterScreen from "./RegisterScreen";
import {
  deleteAuctionImage,
  getAuctionCategories,
  recommendAuctionCategory,
  recommendAuctionPrice,
  registerAuction,
  saveAuctionDraft,
  updateAuction,
  uploadAuctionImage,
} from "@/services/auction/register/service";
import {
  deleteRegularProductImage,
  getRegularProductCategories,
  recommendRegularProductCategory,
  recommendRegularProductPrice,
  registerRegularProduct,
  saveRegularProductDraft,
  uploadRegularProductImage,
} from "@/services/product/register/service";

type RegisterScreenProps = ComponentProps<typeof RegisterScreen>;

export default function RegularRegisterScreen(
  props: Omit<RegisterScreenProps, "getCategories" | "servicesByType">,
) {
  return (
    <RegisterScreen
      {...props}
      getCategories={getRegularProductCategories}
      mode="regular"
      servicesByType={{
        regular: {
          getCategories: getRegularProductCategories,
          uploadImage: uploadRegularProductImage,
          deleteImage: deleteRegularProductImage,
          saveDraft: saveRegularProductDraft,
          recommendCategory: recommendRegularProductCategory,
          recommendPrice: ({ name, description }) =>
            recommendRegularProductPrice({ name, description }),
          register: registerRegularProduct,
        },
        auction: {
          getCategories: getAuctionCategories,
          uploadImage: uploadAuctionImage,
          deleteImage: deleteAuctionImage,
          saveDraft: saveAuctionDraft,
          recommendCategory: recommendAuctionCategory,
          recommendPrice: recommendAuctionPrice,
          register: registerAuction,
          update: (draft, initialData) =>
            updateAuction(initialData.auctionId, draft),
        },
      }}
    />
  );
}
