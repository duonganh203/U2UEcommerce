import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "d2v5dzhdg4zhx3.cloudfront.net",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "res.cloudinary.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "images.unsplash.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "via.placeholder.com",
            port: "",
            pathname: "/**",
         },
      ],
   },
};

export default nextConfig;
