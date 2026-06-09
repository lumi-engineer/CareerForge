import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth", "docx"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@supabase/supabase-js", "@supabase/ssr"],
  },
  webpack: (config) => {
    // Suppress benign webpack filesystem-cache warnings for large edge/CSS payloads.
    config.infrastructureLogging = { level: "error" };

    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        module: /@supabase\/supabase-js/,
        message: /Edge Runtime|process\.version/,
      },
    ];

    return config;
  },
};

export default nextConfig;
