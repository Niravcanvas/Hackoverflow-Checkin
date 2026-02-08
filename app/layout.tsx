/**
 * Root Layout
 *
 * @module app/layout
 * @description Root layout with font configuration and metadata
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import type { ReactNode } from 'react';

// ============================================================================
// Font Configuration
// ============================================================================

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: {
    default: 'Hackoverflow Check-in System',
    template: '%s | Hackoverflow',
  },
  description: 'Participant check-in management system for Hackoverflow 4.0',
  keywords: ['hackathon', 'check-in', 'participants', 'hackoverflow'],
};

// ============================================================================
// Layout Component
// ============================================================================

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
