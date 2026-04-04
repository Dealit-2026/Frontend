"use client";
import React from 'react';
import ProductListScreen from '../products/page';

export default function AuctionListScreen(props: any) {
  return <ProductListScreen {...props} mode="auction" />;
}
