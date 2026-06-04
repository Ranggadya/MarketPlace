import { defineConfig } from "vitest/config";
import path from "path";

const rootDir = path.resolve(__dirname, "..");

export default defineConfig({
  root: rootDir,
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      include: ["src/components/ProductCard.tsx", "src/lib/models/Review.ts"],
      reporter: ["text", "text-summary"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(rootDir, "src") },
  },
});
