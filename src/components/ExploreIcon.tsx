"use client";
import React from 'react';

export const ExploreIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="3" y1="7" x2="8" y2="7" />
    <line x1="3" y1="12" x2="6" y2="12" />
    <line x1="3" y1="17" x2="8" y2="17" />
    <circle cx="16" cy="11" r="5" />
    <path d="m20 15 2.5 2.5" />
  </svg>
);
