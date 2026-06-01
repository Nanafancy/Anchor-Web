"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type Network = "mainnet" | "testnet";

interface NetworkContextValue {
	network: Network;
	setNetwork: (network: Network) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
	const [network, setNetworkState] = useState<Network>("mainnet");

	const setNetwork = useCallback((next: Network) => {
		setNetworkState(next);
	}, []);

	return (
		<NetworkContext.Provider value={{ network, setNetwork }}>
			{children}
		</NetworkContext.Provider>
	);
}

export function useNetwork(): NetworkContextValue {
	const ctx = useContext(NetworkContext);
	if (!ctx) {
		throw new Error("useNetwork must be used within a NetworkProvider");
	}
	return ctx;
}
