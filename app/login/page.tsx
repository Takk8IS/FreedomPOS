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

            const result = await db.query(
                "SELECT * FROM users WHERE email = ?",
                [formData.email],
            );
            const user = result.rows[0];

            if (!user || !isUser(user)) {
                throw new Error("Invalid credentials");
            }

            const isValid = await compare(formData.password, user.password);

            if (!isValid) {
                throw new Error("Invalid credentials");
            }

            await db.query(
                "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
                [user.id],
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    storeName: user.store_name,
                }),
            );

            toast({
                title: "Success",
                description: "Logged in successfully",
            });

            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Error",
                description: "Invalid email or password",
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
