// app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getExtensions } from '@/lib/api-client';
import { ExtensionGrid } from '@/components/dashboard/extension-grid';
import { ExtensionDto } from '@/types/interfaces';

export default function DashboardPage() {
  const [extensions, setExtensions] = useState<ExtensionDto[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const extensionsResponse = await getExtensions();
        if (extensionsResponse.success) {
          setExtensions(extensionsResponse.data.items || []);
          setPagination({
            totalCount: extensionsResponse.data.totalCount,
            pageNumber: extensionsResponse.data.pageNumber,
            pageSize: extensionsResponse.data.pageSize,
            totalPages: extensionsResponse.data.totalPages,
            hasNextPage: extensionsResponse.data.hasNextPage,
            hasPreviousPage: extensionsResponse.data.hasPreviousPage,
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ExtensionGrid 
              extensions={extensions} 
              pagination={pagination} 
            />
          )}
        </div>
      </main>
    </div>
  );
}