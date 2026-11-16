import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Nothing on this site is laid out wider than the 80rem (1280px) shell, so
     * even a 2x display never needs more than ~2560px. The stock list tops out
     * at 3840, and with `sizes="100vw"` on the full-bleed art that is the
     * candidate the browser picks every time — which meant re-encoding
     * 30-megapixel camera originals on every cold request. Capping the ladder
     * here is what keeps the optimizer off the biggest resamples.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    /* Optimized output is content-addressed by (src, width, quality); none of
       these sources change without a filename change, so hold them for a year
       instead of re-encoding on a stale-cache miss. */
    minimumCacheTTL: 31536000,
  },
  /*
   * v1 put everything on one long /services page. v2 splits it into the
   * landing page and the two sides, so old links land on the new front door.
   */
  redirects() {
    return [{ source: "/services", destination: "/", permanent: true }];
  },
};

export default nextConfig;
