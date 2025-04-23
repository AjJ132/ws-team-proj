// app/dashboard/components/extension-grid.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExtensionDto, } from '@/types/interfaces';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { ExtensionCard } from '../extensions/extension-card';

interface ExtensionGridProps {
  extensions: ExtensionDto[];
  pagination: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function ExtensionGrid({ extensions, pagination }: ExtensionGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    } else {
      params.delete('searchTerm');
    }
    
    params.set('pageNumber', '1');
    router.push(`/dashboard?${params.toString()}`);
  };

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageNumber', pageNumber.toString());
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search extensions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {extensions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium">No extensions found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters, or create a new extension.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/create">Create Extension</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extensions.map((extension) => (
              <ExtensionCard key={extension.id} extension={extension} />
            ))}
          </div>

          <Pagination className="mt-6">
            <PaginationContent>
              {pagination.hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === pagination.totalPages || 
                  (page >= pagination.pageNumber - 1 && page <= pagination.pageNumber + 1)
                )
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === pagination.pageNumber}
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              
              {pagination.hasNextPage && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}