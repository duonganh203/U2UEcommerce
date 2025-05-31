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
      ],
   },
};

export default nextConfig;
