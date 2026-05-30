import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			include: [
				"src/utils/exportData.ts",
				"src/hooks/useAnalyticsExport.ts",
				"src/components/analytics/**",
				"src/mock-data/analytics.ts",
				"src/types/analytics.ts",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
