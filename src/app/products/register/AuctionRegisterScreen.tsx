"use client";

import type { ComponentProps } from "react";

import RegisterScreen from "./RegisterScreen";
import {
  deleteAuctionImage,
  getAuctionCategories,
  recommendAuctionCategory,
  recommendAuctionPrice,
  registerAuction,
  reauctionAuction,
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

export default function AuctionRegisterScreen(
  props: Omit<RegisterScreenProps, "getCategories" | "servicesByType"> & {
    reauctionSourceAuctionId?: number;
  },
) {
  const { reauctionSourceAuctionId, ...screenProps } = props;

  return (
    <RegisterScreen
      {...screenProps}
      getCategories={getAuctionCategories}
      mode="auction"
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
          register: reauctionSourceAuctionId
            ? (draft) => reauctionAuction(reauctionSourceAuctionId, draft)
            : registerAuction,
          update: (draft, initialData) =>
            updateAuction(initialData.auctionId, draft),
        },
      }}
    />
  );
}
