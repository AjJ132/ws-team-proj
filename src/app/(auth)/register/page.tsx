'use client';

import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { register, isLoading: isAuthLoading, user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && user) {
      router.push('/dashboard');
    }
  }, [isInitialized, user, router]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      // Using the auth hook register function instead of API client directly
      const result = await register(values.username, values.password);
      
      if (result.success) {
        toast("Account Created!", {
          description: "Your account has been created successfully.",
        });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setAuthError(result.error || "Registration failed. Please try again.");
        toast("Registration Error", {
          description: result.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setAuthError("A system error occurred. Please try again later.");
      toast("System Error", {
        description: "A system error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = isAuthLoading || isSubmitting;

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-t-2 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex min-h-screen w-full items-center justify-center p-4",
      mounted ? "opacity-100" : "opacity-0",
      "transition-opacity duration-500"
    )}>
      <div className="flex w-full flex-col gap-6 max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 lg:py-16">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create an Account</h1>
                    <p className="text-balance text-muted-foreground">
                      Sign up for Gimp Extensions
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              id="username"
                              placeholder="johndoe"
                              disabled={isLoading}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              id="password"
                              type="password"
                              disabled={isLoading}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              id="confirmPassword"
                              type="password"
                              disabled={isLoading}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {authError && (
                    <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Registration Failed</AlertTitle>
                      <AlertDescription>
                        {authError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type='submit'
                    variant="default"
                    className=""
                    disabled={isLoading}
                  >
                    <p className="">
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </p>
                  </Button>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                      Log in
                    </a>
                  </div>
                </div>
              </form>
            </Form>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/placeholder.svg"
                alt="Registration visual"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                fill
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking create account, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;