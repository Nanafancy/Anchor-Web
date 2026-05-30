import "@testing-library/jest-dom";

// Mock navigator.clipboard for all tests
Object.defineProperty(navigator, "clipboard", {
	value: {
		writeText: vi.fn().mockResolvedValue(undefined),
	},
	writable: true,
});
