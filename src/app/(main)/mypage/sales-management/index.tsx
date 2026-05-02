"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ImageIcon, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import {
  deleteSalesManagementProduct,
  fetchAuctionSalesManagementEditInitialData,
  fetchRegularSalesManagementEditInitialData,
  fetchSalesManagementProducts,
  updateAuctionSalesManagementProduct,
  updateRegularSalesManagementProduct,
} from "@/services/sales-management/service";
import type { SalesManagementItemViewModel } from "@/services/sales-management/types";
import RegisterScreen from "../../../products/register/RegisterScreen";
import {
  deleteAuctionImage,
  getAuctionCategories,
  recommendAuctionPrice,
  saveAuctionDraft,
  uploadAuctionImage,
} from "@/services/auction/register/service";
import {
  deleteRegularProductImage,
  getRegularProductCategories,
  recommendRegularProductPrice,
  saveRegularProductDraft,
  uploadRegularProductImage,
} from "@/services/product/register/service";

type SalesManagementFilter = "all" | "regular" | "auction";

interface SalesManagementScreenProps {
  onBack: () => void;
  themeColor: string;
  key?: string;
}

function getFilterLabel(filter: SalesManagementFilter) {
  if (filter === "regular") {
    return "일반";
  }

  if (filter === "auction") {
    return "경매";
  }

  return "전체";
}

function getTypeLabel(type: SalesManagementItemViewModel["type"]) {
  return type === "auction" ? "경매" : "일반";
}

function ProductImage({
  imageUrl,
  name,
  onClick,
}: {
  imageUrl: string | null;
  name: string;
  onClick?: () => void;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={onClick}
    >
      <ImageIcon size={24} />
    </div>
  );
}

export default function SalesManagementScreen({
  onBack,
  themeColor,
}: SalesManagementScreenProps) {
  const router = useRouter();
  const [products, setProducts] = useState<SalesManagementItemViewModel[]>([]);
  const [filter, setFilter] = useState<SalesManagementFilter>("all");
  const [itemToDelete, setItemToDelete] =
    useState<SalesManagementItemViewModel | null>(null);
  const [editingItem, setEditingItem] = useState<{
    product: SalesManagementItemViewModel;
    initialData: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProducts = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setProducts(await fetchSalesManagementProducts());
    } catch (error) {
      setProducts([]);
      setErrorMessage(
        getErrorMessage(error, "판매 중인 상품을 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSalesManagementProduct(itemToDelete);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== itemToDelete.id),
      );
      setItemToDelete(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "상품 삭제에 실패했습니다."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = async (product: SalesManagementItemViewModel) => {
    if (!product.editable || editingProductId) {
      return;
    }

    setEditingProductId(product.id);
    setErrorMessage("");

    try {
      const initialData =
        product.type === "auction"
          ? await fetchAuctionSalesManagementEditInitialData(
              product.auctionId ?? product.productId,
            )
          : await fetchRegularSalesManagementEditInitialData(product.productId);

      setEditingItem({ product, initialData });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "상품 수정 정보를 불러오지 못했습니다."),
      );
    } finally {
      setEditingProductId(null);
    }
  };

  const handleProductImageClick = (product: SalesManagementItemViewModel) => {
    if (product.type === "auction" && product.auctionId) {
      router.push(`/auctions/${product.auctionId}`);
    } else {
      router.push(`/products/${product.productId}`);
    }
  };

  const filteredProducts = products.filter(
    (product) => filter === "all" || product.type === filter,
  );

  if (editingItem) {
    return (
      <RegisterScreen
        onBack={() => setEditingItem(null)}
        onComplete={() => {
          setEditingItem(null);
          void loadProducts();
        }}
        themeColor={themeColor}
        mode={editingItem.product.type}
        initialData={editingItem.initialData}
        getCategories={getAuctionCategories}
        servicesByType={{
          regular: {
            getCategories: getRegularProductCategories,
            uploadImage: uploadRegularProductImage,
            deleteImage: deleteRegularProductImage,
            saveDraft: saveRegularProductDraft,
            recommendPrice: ({ name, description }) =>
              recommendRegularProductPrice({ name, description }),
            register: (draft) =>
              updateRegularSalesManagementProduct(
                editingItem.product.productId,
                draft,
              ),
            update: (draft) =>
              updateRegularSalesManagementProduct(
                editingItem.product.productId,
                draft,
              ),
          },
          auction: {
            getCategories: getAuctionCategories,
            uploadImage: uploadAuctionImage,
            deleteImage: deleteAuctionImage,
            saveDraft: saveAuctionDraft,
            recommendPrice: recommendAuctionPrice,
            register: (draft) =>
              updateAuctionSalesManagementProduct(
                editingItem.product.auctionId ?? editingItem.product.productId,
                draft,
              ),
            update: (draft) =>
              updateAuctionSalesManagementProduct(
                editingItem.product.auctionId ?? editingItem.product.productId,
                draft,
              ),
          },
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col relative"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">
          판매 관리
        </h1>
      </div>

      <div className="px-6 pt-6">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {(["all", "regular", "auction"] as const).map((nextFilter) => (
            <button
              key={nextFilter}
              onClick={() => setFilter(nextFilter)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                filter === nextFilter
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {getFilterLabel(nextFilter)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-500">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm font-medium">
              판매 중인 상품을 불러오는 중입니다
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-gray-100 rounded-2xl space-y-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  <ProductImage
                    imageUrl={item.imageUrl}
                    name={item.name}
                    onClick={() => handleProductImageClick(item)}
                  />
                </div>
                <div className="flex-1 min-w-0 pt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">
                      {getTypeLabel(item.type)}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      {item.statusLabel}
                    </span>
                    {item.bidders !== null && (
                      <span className="text-[11px] font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded">
                        입찰 {item.bidders}명
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-base truncate">{item.name}</h4>
                  <p className="font-black text-lg">{item.priceLabel}</p>
                  {item.location && (
                    <p className="text-[11px] text-gray-400 truncate">
                      {item.category} · {item.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleEditClick(item)}
                  disabled={!item.editable || editingProductId === item.id}
                  className="h-14 bg-gray-50 rounded-xl text-sm font-bold transition-colors disabled:text-gray-300 enabled:hover:bg-gray-100"
                >
                  {editingProductId === item.id ? "불러오는 중" : "수정"}
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  disabled={!item.deletable}
                  className="h-14 bg-gray-50 rounded-xl text-sm font-bold text-red-500 transition-colors disabled:text-gray-300 enabled:hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm font-medium">판매 중인 상품이 없습니다</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {itemToDelete !== null && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setItemToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-xl"
            >
              <h3 className="text-lg font-bold text-center mb-2">
                삭제하시겠습니까?
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                {itemToDelete.name}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {isDeleting ? "삭제 중" : "삭제"}
                </button>
                <button
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-60"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
