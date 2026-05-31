import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRecovery } from "../useRecovery";

describe("useRecovery", () => {
	it("starts in idle state", () => {
		const { result } = renderHook(() => useRecovery());
		expect(result.current.state).toBe("idle");
		expect(result.current.errorMessage).toBeNull();
	});

	it("transitions idle → confirming on initiateRecovery", async () => {
		const { result } = renderHook(() => useRecovery());
		await act(async () => {
			result.current.initiateRecovery();
		});
		expect(result.current.state).toBe("confirming");
	});

	it("transitions confirming → idle on cancelRecovery", async () => {
		const { result } = renderHook(() => useRecovery());
		await act(async () => {
			result.current.initiateRecovery();
		});
		await act(async () => {
			result.current.cancelRecovery();
		});
		expect(result.current.state).toBe("idle");
	});

	it("transitions confirming → pending → success on confirmRecovery", async () => {
		const { result } = renderHook(() => useRecovery());

		await act(async () => {
			result.current.initiateRecovery();
		});
		expect(result.current.state).toBe("confirming");

		// confirmRecovery is async; await it fully (real timers, stub resolves in 1.5s)
		await act(async () => {
			await result.current.confirmRecovery();
		});

		expect(result.current.state).toBe("success");
	});

	it("does not transition from idle on cancelRecovery", async () => {
		const { result } = renderHook(() => useRecovery());
		await act(async () => {
			result.current.cancelRecovery();
		});
		expect(result.current.state).toBe("idle");
	});

	it("does not re-initiate when already confirming", async () => {
		const { result } = renderHook(() => useRecovery());
		await act(async () => {
			result.current.initiateRecovery();
		});
		await act(async () => {
			result.current.initiateRecovery(); // no-op
		});
		expect(result.current.state).toBe("confirming");
	});

	it("resets to idle from success on resetRecovery", async () => {
		const { result } = renderHook(() => useRecovery());

		await act(async () => {
			result.current.initiateRecovery();
		});
		await act(async () => {
			await result.current.confirmRecovery();
		});
		expect(result.current.state).toBe("success");

		await act(async () => {
			result.current.resetRecovery();
		});
		expect(result.current.state).toBe("idle");
	});

	it("allows re-initiation from error state", async () => {
		const { result } = renderHook(() => useRecovery());
		await act(async () => {
			result.current.initiateRecovery();
		});
		await act(async () => {
			result.current.cancelRecovery();
		});
		await act(async () => {
			result.current.initiateRecovery();
		});
		expect(result.current.state).toBe("confirming");
	});
});
