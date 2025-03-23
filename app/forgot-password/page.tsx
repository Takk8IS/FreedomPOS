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
import { Store, ArrowLeft, Loader2 } from "lucide-react";
import { randomBytes } from "crypto";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const result = await db.query(
                "SELECT id FROM users WHERE email = ?",
                [email],
            );

            if (result.rows.length === 0) {
                throw new Error("User not found");
            }

            const token = randomBytes(32).toString("hex");
            const expires = new Date();
            expires.setHours(expires.getHours() + 1);

            await db.query(
                `UPDATE users
         SET reset_token = ?,
             reset_token_expires = ?
         WHERE email = ?`,
                [token, expires.toISOString(), email],
            );

            router.push(`/reset-password?token=${token}`);

            toast({
                title: "Success",
                description:
                    "Password reset instructions have been sent to your email",
            });
        } catch (error) {
            console.error("Password reset error:", error);
            toast({
                title: "Error",
                description: "Email address not found",
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
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you
                        instructions to reset your password
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    Sending Instructions...
                                </>
                            ) : (
                                "Send Reset Instructions"
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
