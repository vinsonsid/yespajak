// Lint: engine base (strict TS + layering) + Next core-web-vitals + test rules.
import nextConfig from "@jangkar/testing-engines/eslint/next";

const config = [...(await nextConfig()), { ignores: ["out/**", "build/**", "coverage/**", "reports/**"] }];

export default config;
