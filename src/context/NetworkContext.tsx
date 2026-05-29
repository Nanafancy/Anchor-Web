"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WalletNetwork } from "@/types/wallet";

const STORAGE_KEY = "mux_network";
const VALID_NETWORKS: WalletNetwork[] = ["mainnet", "testnet"];
const DEFAULT_NETWORK: WalletNetwork = "mainnet";

function readStoredNetwork(): WalletNetwork {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && (VALID_NETWORKS as string[]).includes(stored)) {
			return stored as WalletNetwork;
		}
	} catch {
		// localStorage unavailable (SSR, private browsing restrictions)
	}
	return DEFAULT_NETWORK;
}

interface NetworkContextValue {
	network: WalletNetwork;
	setNetwork: (network: WalletNetwork) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
	const [network, setNetworkState] = useState<WalletNetwork>(DEFAULT_NETWORK);

	// Hydrate from localStorage after mount (avoids SSR mismatch)
	useEffect(() => {
		setNetworkState(readStoredNetwork());
	}, []);

	function setNetwork(next: WalletNetwork) {
		setNetworkState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// ignore write failures
		}
	}

	return (
		<NetworkContext.Provider value={{ network, setNetwork }}>
			{children}
		</NetworkContext.Provider>
	);
}

export function useNetwork(): NetworkContextValue {
	const ctx = useContext(NetworkContext);
	if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
	return ctx;
}
