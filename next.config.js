/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
};

/**
 * Determine if we're building for Tauri (desktop) or web
 * 
 * This allows us to:
 * - Use static export for Tauri builds (output: "export")
 * - Enable middleware and server-side features for web builds
 */
const isTauriBuild = process.env.TAURI_BUILD === "true";

if (isTauriBuild) {
    // When building for Tauri, use static export
    nextConfig.output = "export";
    nextConfig.images = { unoptimized: true };
    
    console.log("🖥️ Building for Tauri desktop app (static export)");
} else {
    // When building for web, enable middleware and server-side features
    // by not using "export" output
    nextConfig.images = { 
        unoptimized: false,
        // Add any other image optimizations for web here
    };
    
    console.log("🌐 Building for web (with middleware and server-side features)");
}

module.exports = nextConfig;
