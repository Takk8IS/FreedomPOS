import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get the pathname
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const isPublicPath =
        path === "/login" || path === "/signup" || path === "/forgot-password";

    // Check if user is authenticated
    const isAuthenticated = request.cookies.has("user");

    // Redirect authenticated users away from public paths
    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Configure paths that trigger the middleware
export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api (API routes)
         * 2. /_next (Next.js internals)
         * 3. /static (static files)
         * 4. .*\\..*$ (files with extensions)
         */
        "/((?!api|_next|static|.*\\..*$).*)",
    ],
};
