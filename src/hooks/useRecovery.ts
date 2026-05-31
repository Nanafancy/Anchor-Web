"use client";

import { useCallback, useState } from "react";

export type RecoveryState = "idle" | "confirming" | "pending" | "success" | "error";

export interface UseRecoveryReturn {
	state: RecoveryState;
	errorMessage: string | null;
	initiateRecovery: () => void;
	confirmRecovery: () => Promise<void>;
	cancelRecovery: () => void;
	resetRecovery: () => void;
}

/**
 * Stub hook for initiating wallet recovery.
 * Manages the recovery flow state machine:
 *   idle → confirming → pending → success | error
 *
 * The `confirmRecovery` function is a stub that simulates an async API call.
 * Replace the body with a real API integration when the backend is ready.
 */
export function useRecovery(): UseRecoveryReturn {
	const [state, setState] = useState<RecoveryState>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const initiateRecovery = useCallback(() => {
		if (state !== "idle" && state !== "error") return;
		setErrorMessage(null);
		setState("confirming");
	}, [state]);

	const confirmRecovery = useCallback(async () => {
		if (state !== "confirming") return;
		setState("pending");
		try {
			// TODO: replace with real API call, e.g. await recoveryApi.initiate()
			await new Promise<void>((resolve) => setTimeout(resolve, 1500));
			setState("success");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "An unexpected error occurred.";
			setErrorMessage(message);
			setState("error");
		}
	}, [state]);

	const cancelRecovery = useCallback(() => {
		if (state !== "confirming") return;
		setState("idle");
		setErrorMessage(null);
	}, [state]);

	const resetRecovery = useCallback(() => {
		setState("idle");
		setErrorMessage(null);
	}, []);

	return {
		state,
		errorMessage,
		initiateRecovery,
		confirmRecovery,
		cancelRecovery,
		resetRecovery,
	};
}
