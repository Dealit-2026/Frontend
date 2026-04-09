"use client";
import React from 'react';
import RegisterScreen from '../../products/register/RegisterScreen';

export default function AuctionRegisterScreen(props: any) {
  return <RegisterScreen {...props} mode="auction" />;
}
