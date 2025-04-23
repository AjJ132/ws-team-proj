'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ExtensionDto, ExtensionUpdateDto } from '@/types/interfaces';
import { getExtension, updateExtension } from '@/lib/api-client';
import { toast } from "sonner";
import { TagsSelector } from '../tags/tags-selector';

interface EditExtensionModalProps {
  extensionId: string;
  trigger?: React.ReactNode;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Extension name is required',
  }).max(100, {
    message: 'Extension name must be less than 100 characters',
  }),
  description: z.string().max(1000, {
    message: 'Description must be less than 1000 characters',
  }).optional(),
  tagIds: z.array(z.string()).optional(),
});

const EditExtensionModal: React.FC<EditExtensionModalProps> = ({ extensionId, trigger }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extension, setExtension] = useState<ExtensionDto | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      tagIds: [],
    },
  });

  // Fetch extension data when modal opens
  useEffect(() => {
    const fetchExtensionData = async () => {
      if (isOpen && extensionId) {
        setIsLoading(true);
        try {
          const response = await getExtension(extensionId);
          if (response.success && response.data) {
            setExtension(response.data);
            
            // Set form values
            form.reset({
              name: response.data.name,
              description: response.data.description || '',
              tagIds: response.data.tags?.map(tag => tag.id) || [],
            });
          } else {
            throw new Error(response.message || 'Failed to fetch extension');
          }
        } catch (error) {
          toast('Error', {
            description: error instanceof Error ? error.message : 'An error occurred',
          });
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchExtensionData();
  }, [isOpen, extensionId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Get userId from localStorage to verify ownership
      const userId = localStorage.getItem('user_id');
      if (!userId || (extension && extension.uploaderId !== userId)) {
        throw new Error('You are not authorized to edit this extension');
      }

      const extensionData: ExtensionUpdateDto = {
        name: values.name,
        description: values.description || '',
        tagIds: values.tagIds,
      };

      const response = await updateExtension(extensionId, extensionData);
      
      if (response.success) {
        toast("Extension Updated", {
          description: 'Your extension has been updated successfully.',
        });
        
        // Close the dialog and refresh data
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(response.message || 'Failed to update extension');
      }
    } catch (error) {
      toast('Error', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="icon" className="h-8 w-8">
      <EditIcon className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Extension</DialogTitle>
          <DialogDescription>
            Update the details of your extension.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Extension name" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive name for your extension
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what your extension does"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain the purpose and features of your extension
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tagIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagsSelector
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select tags"
                      />
                    </FormControl>
                    <FormDescription>
                      Select tags to categorize your extension
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditExtensionModal;