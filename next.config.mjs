/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true, // Enable gzip compression

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Increase the body size limit to 5 MB
    },
  },

  images: {
    // Image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "hpymvpexiunftdgeobiw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "hpymvpexiunftdgeobiw.supabase.co",
        pathname: "/storage/v1/render/image/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assalam.org",
        pathname: "/**",
      },
    ],
  },

  // Build optimizations
  generateEtags: false, // Disable etag generation for faster builds

  // Enable JSON imports
  transpilePackages: ['next'],

  // Optimize static generation for gallery data
  staticPageGenerationTimeout: 300, // Increase timeout to 5 minutes for static generation

  // Enhanced caching and performance
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|webp|avif|ico|svg|woff|woff2|ttf|eot)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache API routes for 5 minutes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        // Cache blog and project pages for 10 minutes with revalidation
        source: '/(blogs|projects)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Security headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },


  // Enable modern output format
  output: 'standalone',
};

export default nextConfig;
