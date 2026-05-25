import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ForegroundNotificationListener } from '../services/notifications/ForegroundNotificationListener';

export const metadata: Metadata = {
  title: 'Dealit',
  description: 'Dealit',
  applicationName: 'Dealit',
  manifest: '/manifest.json',
  icons: {
    icon: '/dealit-logo.svg',
    apple: '/dealit-logo.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'Dealit',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ForegroundNotificationListener />
        {children}
      </body>
    </html>
  );
}
