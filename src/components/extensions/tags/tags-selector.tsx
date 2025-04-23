'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getTags } from '@/lib/api-client';
import { TagDto } from '@/types/interfaces';

export type TagOption = {
  id: string;
  label: string;
  value: string;
};

interface TagsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagsSelector({
  value,
  onChange,
  placeholder = 'Select tags',
  className,
}: TagsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<TagOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial tags
  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTags();
        if (response.success) {
          const mappedOptions = response.data.map((tag: TagDto) => ({
            id: tag.id,
            label: tag.name,
            value: tag.id
          }));
          setOptions(mappedOptions);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tags');
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  // Filter tags based on search term
  const filteredOptions = searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleUnselect = (itemValue: string) => {
    onChange(value.filter((v) => v !== itemValue));
  };

  const handleSelect = (itemValue: string) => {
    onChange([...value, itemValue]);
  };

  // Get labels and values for selected items
  const selectedItems = value.map(v => {
    const option = options.find(opt => opt.value === v);
    return {
      value: v,
      label: option?.label || v
    };
  });

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between', className)}
          >
            <span className="truncate">
              {value.length > 0 
                ? `${value.length} tag${value.length > 1 ? 's' : ''} selected` 
                : placeholder}
            </span>
            <div className="opacity-60 shrink-0">↓</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Search tags..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <p className="text-sm text-muted-foreground">Loading tags...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4">
                <p className="text-sm text-destructive">Error: {error}</p>
              </div>
            )}
            
            {!isLoading && !error && filteredOptions.length === 0 && (
              <CommandEmpty>No tags found.</CommandEmpty>
            )}
            
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        handleUnselect(option.value);
                      } else {
                        handleSelect(option.value);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12L10 17L20 7" />
                      </svg>
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected tags area */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedItems.map((item) => (
            <Badge key={item.value} variant="default" className="pl-2 pr-1 py-1">
              {item.label}
              <span 
                role="button"
                tabIndex={0}
                className="ml-1 cursor-pointer inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnselect(item.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUnselect(item.value);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}