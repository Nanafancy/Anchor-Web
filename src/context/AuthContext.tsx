"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export interface AuthUser {
	name: string;
	email: string;
	role: string;
}

interface AuthContextValue {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (user: AuthUser) => void;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "mux_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Rehydrate from sessionStorage on mount
	useEffect(() => {
		try {
			const stored = sessionStorage.getItem(SESSION_KEY);
			if (stored) {
				setUser(JSON.parse(stored) as AuthUser);
			}
		} catch {
			// Ignore parse errors — treat as unauthenticated
		} finally {
			setIsLoading(false);
		}
	}, []);

	const signIn = useCallback((authUser: AuthUser) => {
		sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
		setUser(authUser);
	}, []);

	const signOut = useCallback(() => {
		sessionStorage.removeItem(SESSION_KEY);
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: user !== null,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
