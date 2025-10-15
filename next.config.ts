import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors are present
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if TypeScript errors are present
    ignoreBuildErrors: false,
  },
  experimental: {
    // Ensure React 19 JSX transform compatibility
    reactCompiler: false,
  },
  compiler: {
    // Remove React imports when using new JSX transform
    removeConsole: false,
  },
};

export default nextConfig;
