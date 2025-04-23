"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getExtensions } from '@/lib/api-client';
import { ExtensionGrid } from '@/components/dashboard/extension-grid';
import { ExtensionDto, ExtensionFilterDto } from '@/types/interfaces';

// Loading component to display while data is being fetched
function LoadingState() {
  return <div className="flex items-center justify-center py-10">Loading...</div>;
}

// Component that uses searchParams
function DashboardContent() {
  const searchParams = useSearchParams();
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
        // Get search parameters from URL
        const searchTerm = searchParams.get('searchTerm') || '';
        const uploaderId = searchParams.get('uploaderId') || '';
        const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
        
        // Create filter object
        const filters: ExtensionFilterDto = {
          searchTerm,
          pageNumber,
          pageSize
        };
        
        // Add uploaderId to filters if present
        if (uploaderId) {
          filters.uploaderId = uploaderId;
        }
        
        // Call API with filters
        const extensionsResponse = await getExtensions(filters);
        
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
  }, [searchParams]); // Re-run when searchParams changes

  return (
    <div>
      {loading ? (
        <LoadingState />
      ) : (
        <ExtensionGrid 
          extensions={extensions} 
          pagination={pagination} 
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
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
          <Suspense fallback={<LoadingState />}>
            <DashboardContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}