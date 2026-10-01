import { defineConfig } from 'vitest/config';
// Les tests e2e (Chromium) se lancent a part : npm run fumee
export default defineConfig({ test: { include: ['tests/**/*.test.js'] } });
