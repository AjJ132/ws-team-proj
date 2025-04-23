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

const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const { login, isLoading: isAuthLoading, user, isInitialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        return () => {
            setIsSubmitting(false);
        };
    }, []);

    // Redirect if already authenticated
    useEffect(() => {
        if (mounted && isInitialized && user) {
            router.push('/dashboard');
        }
    }, [isInitialized, user, router, mounted]);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            setIsSubmitting(true);
            setAuthError(null);
            
            // Using the auth hook login function
            const result = await login(values.username, values.password);
            
            if (result.success) {
                toast("Welcome Back!", {
                  description: "You have successfully logged in.",
                });
                
                router.push('/dashboard');
            } else {
                setAuthError(result.error || "Authentication failed. Please try again.");
                toast("Authentication Error", {
                    description: result.error || "Authentication failed. Please try again.",
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
                                        <h1 className="text-2xl font-bold">Welcome back</h1>
                                        <p className="text-balance text-muted-foreground">
                                            Login to your Gimp Extensions account
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

                                    {authError && (
                                        <Alert variant="destructive">
                                            <Terminal className="h-4 w-4" />
                                            <AlertTitle>Authentication Failed</AlertTitle>
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
                                          {isLoading ? 'Logging in...' : 'Login'}
                                        </p>
                                    </Button>

                                    <div className="text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <a href="/register" className="underline underline-offset-4">
                                            Sign up
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </Form>
                        <div className="relative hidden bg-muted md:block">
                            <Image
                                src="/placeholder.svg"
                                alt="Login visual"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                fill
                            />
                        </div>
                    </CardContent>
                </Card>
                
            </div>
        </div>
    );
};

export default LoginPage;