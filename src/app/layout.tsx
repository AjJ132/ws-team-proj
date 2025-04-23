// src/app/layout.tsx
import React from 'react';


import "./globals.css";
import { AuthProvider } from '@/hooks/use-auth';
import { Providers } from '@/components/providers/providers';
import { Toaster } from '@/components/ui/sonner';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}