"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Store, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { hash } from "bcryptjs";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const token = searchParams.get("token");

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setValidToken(false);
                return;
            }

            try {
                const result = await db.query(
                    `SELECT id FROM users
           WHERE reset_token = ?
           AND reset_token_expires > CURRENT_TIMESTAMP`,
                    [token],
                );

                setValidToken(result.rows.length > 0);
            } catch (error) {
                console.error("Token validation error:", error);
                setValidToken(false);
            }
        };

        validateToken();
    }, [token]);

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

            const hashedPassword = await hash(formData.password, 10);

            await db.query(
                `UPDATE users
         SET password = ?,
             reset_token = NULL,
             reset_token_expires = NULL
         WHERE reset_token = ?`,
                [hashedPassword, token],
            );

            toast({
                title: "Success",
                description: "Your password has been reset successfully",
            });

            router.push("/login");
        } catch (error) {
            console.error("Password reset error:", error);
            toast({
                title: "Error",
                description: "Failed to reset password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!validToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-2 text-center">
                        <div className="flex justify-center mb-4 text-destructive">
                            <AlertCircle className="h-12 w-12" />
                        </div>
                        <CardTitle className="text-2xl">
                            Invalid or Expired Link
                        </CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired.
                            Please request a new one.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link href="/forgot-password">
                            <Button>Request New Reset Link</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-4">
                        <Store className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter new password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                required
                                value={formData.confirmPassword}
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
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                        <Link
                            href="/login"
                            className="flex items-center justify-center text-sm text-primary hover:underline"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
