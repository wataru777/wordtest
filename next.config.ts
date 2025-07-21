import type { NextConfig } from "next";

// package.jsonを読み込み
const packageJson = require('./package.json');

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: packageJson.version || '0.2.0',
    BUILD_DATE: new Date().toISOString().split('T')[0],
  }
};

export default nextConfig;
