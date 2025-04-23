'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // This prevents hydration mismatch by only rendering on the client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure
    // but without any theme-specific attributes
    return <>{children}</>;
  }

  return (
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>

              {children}
            </AuthProvider>
    </ThemeProvider>
  );
}