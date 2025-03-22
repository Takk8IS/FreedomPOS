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
import { hash } from "bcryptjs";
import { Store } from "lucide-react";

// Adicionar esta importação no topo do arquivo
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        storeName: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }
    
        try {
            setLoading(true);
            
            // Usar a API do Supabase para cadastro
            const supabase = createClientComponentClient();
            
            console.log("Iniciando cadastro no Supabase...");
            
            // Criar o usuário na autenticação do Supabase com metadados
            // incluindo todas as informações necessárias
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        store_name: formData.storeName,
                        role: "admin"
                    },
                    // Para ambiente de desenvolvimento, podemos desativar a confirmação de email
                    // Remova esta linha em produção
                    emailRedirectTo: `${window.location.origin}/login`
                }
            });
            
            console.log("Resposta do Supabase:", authData, authError);
            
            if (authError) {
                console.error("Erro de autenticação:", authError);
                throw authError;
            }
            
            if (!authData.user) {
                console.error("Usuário não criado no Supabase");
                throw new Error("Failed to create user account");
            }
            
            // Verificar se o usuário precisa confirmar o email
            if (authData.user && !authData.user.email_confirmed_at) {
                toast({
                    title: "Account Created",
                    description: "Please check your email to confirm your account before logging in.",
                    duration: 6000,
                });
            } else {
                toast({
                    title: "Success",
                    description: "Account created successfully. You can now log in.",
                });
            }
    
            router.push("/login");
        } catch (error) {
            console.error("Signup error:", error);
            
            // Melhorar a mensagem de erro para o usuário
            let errorMessage = "Failed to create account. Please try again.";
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                errorMessage = JSON.stringify(error);
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
                    <CardTitle className="text-2xl">
                        Create your FreedomPOS Account
                    </CardTitle>
                    <CardDescription>
                        Enter your information to create your store account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                name="storeName"
                                placeholder="Enter your store name"
                                required
                                value={formData.storeName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
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
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
