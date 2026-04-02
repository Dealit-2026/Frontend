"use client";
import React from 'react';
import ProductDetailScreen from '../../products/[productId]/page';

export default function AuctionDetailScreen(props: any) {
  return <ProductDetailScreen {...props} mode="auction" />;
}
