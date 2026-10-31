import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @roleradar/core ships TypeScript source; Next compiles it.
  transpilePackages: ["@roleradar/core"],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
