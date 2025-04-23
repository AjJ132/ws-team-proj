/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExtensionDto, UploaderDto } from '@/types/interfaces';
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
  const [selectedUploaderId, setSelectedUploaderId] = useState(searchParams.get('uploaderId') || '');
  const [uploaders, setUploaders] = useState<UploaderDto[]>([]);
  console.log('Uploaders:', uploaders);
  const [isLoadingUploaders, setIsLoadingUploaders] = useState(false);

  // Fetch uploaders when component mounts
  useEffect(() => {
    async function fetchUploaders() {
      setIsLoadingUploaders(true);
      try {
        const response = await fetch('/api/uploaders');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUploaders(data.data);
          }
        } else {
          console.error('Failed to fetch uploaders');
        }
      } catch (error) {
        console.error('Error fetching uploaders:', error);
      } finally {
        setIsLoadingUploaders(false);
      }
    }

    fetchUploaders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    } else {
      params.delete('searchTerm');
    }
    
    // Add uploader ID to query params if selected
    if (selectedUploaderId) {
      params.set('uploaderId', selectedUploaderId);
    } else {
      params.delete('uploaderId');
    }
    
    params.set('pageNumber', '1');
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleUploaderChange = (value: string) => {
    // Handle 'all' value as empty string for the API
    const uploaderId = value === 'all' ? '' : value;
    setSelectedUploaderId(uploaderId);
    
    // Trigger search immediately when an uploader is selected
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    } else {
      params.delete('searchTerm');
    }
    
    if (uploaderId) {
      params.set('uploaderId', uploaderId);
    } else {
      params.delete('uploaderId');
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
          
          {/* Uploader Select Dropdown */}
          <Select value={selectedUploaderId} onValueChange={handleUploaderChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by uploader" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All uploaders</SelectItem>
              {uploaders.map((uploader) => (
                <SelectItem key={uploader.userId} value={uploader.userId}>
                  {uploader.user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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