"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import db from "@/lib/db";
import { isUser } from "@/lib/db/types";
import { compare } from "bcryptjs";
import { Store, Loader2 } from "lucide-react";

// Adicionar esta importação no topo do arquivo
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            setLoading(true);
            
            const supabase = createClientComponentClient();
            console.log("Attempting to sign in with:", formData.email);
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            
            if (error) {
                console.error("Authentication error:", error);
                // Tratamento específico para erro de email não confirmado
                if (error.message === "Email not confirmed") {
                    // Opcionalmente, podemos reenviar o email de confirmação
                    await supabase.auth.resend({
                        type: 'signup',
                        email: formData.email,
                        options: {
                            emailRedirectTo: `${window.location.origin}/login`,
                        },
                    });
                    
                    toast({
                        title: "Email not confirmed",
                        description: "Please check your inbox and confirm your email. We've sent a new confirmation email.",
                        variant: "destructive",
                        duration: 6000,
                    });
                } else {
                    throw error;
                }
                return;
            }
            
            if (!data.user) {
                console.error("No user returned from authentication");
                throw new Error("User not found");
            }
            
            console.log("Authentication successful, user ID:", data.user.id);
            
            // Create a basic user object with available information from auth
            const basicUserData = {
                id: data.user.id,
                name: data.user.user_metadata?.full_name || "User",
                email: data.user.email,
                role: data.user.user_metadata?.role || "user",
                storeName: data.user.user_metadata?.store_name || "Default Store"
            };
            
            console.log("Created basic user data from auth:", basicUserData);
            
            // Store this basic data immediately
            localStorage.setItem("user", JSON.stringify(basicUserData));
            
            // Try to get additional user data, but don't block login if it fails
            try {
                console.log("Fetching user data for ID:", data.user.id);
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, name, email, role, store_name')
                    .eq('id', data.user.id)
                    .single();
                    
                console.log("User data query response:", userData, userError);
                    
                if (!userError && userData) {
                    console.log("User data found in database:", userData);
                    // Update with more complete data from database
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            role: userData.role,
                            storeName: userData.store_name,
                        }),
                    );
                } else {
                    console.log("Using basic user data from auth");
                }
            } catch (profileError) {
                // Just log the error but continue with login
                console.error("Error fetching additional user data:", profileError);
                console.log("Continuing with basic user data");
            }
    
            toast({
                title: "Success",
                description: "Logged in successfully",
            });
    
            router.push("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "Invalid email or password";
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-4">
                        <Store className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Log in to your FreedomPOS account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Log in"
                            )}
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-primary hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
