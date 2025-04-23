'use client';

import React, { useState } from 'react';
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
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ExtensionCreateDto } from '@/types/interfaces';
import { createExtension } from '@/lib/api-client';
import { toast } from "sonner";
import { TagsSelector } from './tags/tags-selector';


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

const CreateExtensionModal: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      tagIds: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Get userId from localStorage for uploaderId
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const extensionData: ExtensionCreateDto = {
        uploaderId: userId,
        name: values.name,
        description: values.description || '',
        tagIds: values.tagIds,
      };

      const response = await createExtension(extensionData);
      
      if (response.success) {
        toast("Extension Created", {
          description: 'Your extension has been created successfully.',
        });
        
        // Close the dialog and refresh data
        setIsOpen(false);
        form.reset();
        router.refresh();
        
        // Redirect to extension details page
        router.push(`/dashboard/extensions/${response.data.id}`);
      } else {
        throw new Error(response.message || 'Failed to create extension');
      }
    } catch (error) {
      toast('Error', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Extension
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Extension</DialogTitle>
          <DialogDescription>
            Create a new extension to share with the community. You can add details and upload files later.
          </DialogDescription>
        </DialogHeader>
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
                {isSubmitting ? 'Creating...' : 'Create Extension'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExtensionModal;