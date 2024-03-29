// @ts-check
import { env } from "./src/env/server.mjs";

import bundleAnalyzer from "@next/bundle-analyzer";
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  })(config);
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  images: {
    domains: ["cdn.discordapp.com"],
  },
});
