// app/dashboard/page.tsx
import { Metadata } from 'next';
import { getExtensions } from '@/lib/api-client';
import { ExtensionGrid } from '@/components/dashboard/extension-grid';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Extensions Dashboard',
  description: 'Browse and manage extensions',
};

export default async function DashboardPage() {
  // Fetch extensions and tags server-side
  const [extensionsResponse] = await Promise.all([
    getExtensions(),
  ]);

  const extensions = extensionsResponse.data.items || [];
  const pagination = {
    totalCount: extensionsResponse.data.totalCount,
    pageNumber: extensionsResponse.data.pageNumber,
    pageSize: extensionsResponse.data.pageSize,
    totalPages: extensionsResponse.data.totalPages,
    hasNextPage: extensionsResponse.data.hasNextPage,
    hasPreviousPage: extensionsResponse.data.hasPreviousPage,
  };

  return (
    <div className="flex flex-col min-h-screen space-y-8 py-8 bg-background">
      
      <main className="flex-1">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Extensions</h1>
          
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Browse and manage your extensions
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ExtensionGrid 
              extensions={extensions} 
              pagination={pagination} 
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}