"use client";
import React from 'react';
import RegisterScreen from '../../products/register/page';

export default function AuctionRegisterScreen(props: any) {
  return <RegisterScreen {...props} mode="auction" />;
}
