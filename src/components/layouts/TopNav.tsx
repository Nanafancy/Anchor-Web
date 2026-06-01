"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";

interface TopNavProps {
	onMenuClick: () => void;
}

const networkLabel = { mainnet: "Mainnet", testnet: "Testnet" } as const;
const networkBadgeClass = {
	mainnet: "bg-blue-100 text-blue-800",
	testnet: "bg-amber-100 text-amber-800",
} as const;

export function TopNav({ onMenuClick }: TopNavProps) {
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const pathname = usePathname();
	const { network, setNetwork } = useNetwork();
	const { user, isLoading, signOut } = useAuth();
	const userMenuRef = useRef<HTMLDivElement>(null);

	// Derive page title from the last path segment
	const pageTitle = (() => {
		const segment = pathname.split("/").pop() ?? "";
		const titleMap: Record<string, string> = {
			dashboard: "Dashboard",
			analytics: "Analytics",
			users: "Users",
			orders: "Orders",
			documents: "Documents",
			settings: "Settings",
			wallets: "Wallets",
			"api-keys": "API Keys",
			"spending-limits": "Spending Limits",
		};
		return (
			titleMap[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
		);
	})();

	// Sync browser tab title
	useEffect(() => {
		document.title = `${pageTitle} · ${networkLabel[network]} — Mux`;
	}, [pageTitle, network]);

	// Close user menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setUserMenuOpen(false);
			}
		}
		if (userMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [userMenuOpen]);

	// Close user menu on Escape key
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setUserMenuOpen(false);
			}
		}
		if (userMenuOpen) {
			document.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [userMenuOpen]);

	/** Handle logout: call signOut from AuthContext (issue #45). */
	function handleLogout() {
		setUserMenuOpen(false);
		signOut();
	}

	return (
		<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/95 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 backdrop-blur">
			{/* Hamburger — mobile only */}
			<button
				type="button"
				onClick={onMenuClick}
				className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
				aria-label="Open sidebar"
			>
				<svg
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>

			{/* Separator */}
			<div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

			{/* Page title + breadcrumbs */}
			<div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
				<div className="flex flex-1 items-center">
					<h1 className="flex items-center gap-2 text-lg font-semibold text-gray-900 sm:text-xl">
						{pageTitle}
						<span
							className={`rounded-full px-2 py-0.5 text-xs font-medium ${networkBadgeClass[network]}`}
						>
							{networkLabel[network]}
						</span>
					</h1>

					{/* Breadcrumbs — hidden on mobile */}
					<nav
						aria-label="Breadcrumb"
						className="hidden lg:ml-6 lg:flex lg:items-center"
					>
						<ol className="flex items-center space-x-2 text-sm">
							<li className="text-gray-500">Home</li>
							<li className="text-gray-400">/</li>
							<li className="flex items-center gap-1.5 font-medium text-gray-900">
								{pageTitle}
								<span
									className={`rounded-full px-2 py-0.5 text-xs font-medium ${networkBadgeClass[network]}`}
								>
									{networkLabel[network]}
								</span>
							</li>
						</ol>
					</nav>
				</div>

				{/* Right-side actions */}
				<div className="flex items-center gap-x-3 sm:gap-x-6">
					{/* Network Switcher */}
					<div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium">
						<button
							type="button"
							onClick={() => setNetwork("testnet")}
							className={`rounded-md px-3 py-1 transition-colors ${
								network === "testnet"
									? "bg-amber-100 text-amber-800"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							Testnet
						</button>
						<button
							type="button"
							onClick={() => setNetwork("mainnet")}
							className={`rounded-md px-3 py-1 transition-colors ${
								network === "mainnet"
									? "bg-blue-100 text-blue-800"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							Mainnet
						</button>
					</div>

					{/* Notifications */}
					<button
						type="button"
						className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="View notifications"
					>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							/>
						</svg>
						<span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
					</button>

					{/* User dropdown (issue #45 — logout action) */}
					<div className="relative" ref={userMenuRef}>
						<button
							type="button"
							onClick={() => setUserMenuOpen((prev) => !prev)}
							className="flex items-center gap-x-3 rounded-lg p-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							id="user-menu-button"
							aria-haspopup="true"
							aria-expanded={userMenuOpen}
							aria-controls="user-menu"
						>
							{isLoading ? (
								<div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
							) : user ? (
								<>
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
										{user.name
											.split(" ")
											.map((n) => n[0])
											.slice(0, 2)
											.join("")
											.toUpperCase()}
									</div>
									<div className="hidden lg:block text-left">
										<p className="text-sm font-medium text-gray-900">
											{user.name}
										</p>
									</div>
								</>
							) : (
								<div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
							)}
							{/* Chevron down */}
							<svg
								className="hidden h-5 w-5 text-gray-400 lg:block"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 8.25l-7.5 7.5-7.5-7.5"
								/>
							</svg>
						</button>

						{/* Dropdown menu */}
						{userMenuOpen && (
							<div
								id="user-menu"
								role="menu"
								aria-labelledby="user-menu-button"
								className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
							>
								{user && (
									<div className="border-b border-gray-100 px-4 py-3">
										<p className="text-sm font-medium text-gray-900 truncate">
											{user.name}
										</p>
										<p className="text-xs text-gray-500 truncate">
											{user.email}
										</p>
									</div>
								)}

								{/* Logout button (issue #45) */}
								<button
									type="button"
									role="menuitem"
									onClick={handleLogout}
									className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
									data-testid="logout-button"
								>
									{/* Arrow-right-on-rectangle icon via inline SVG */}
									<svg
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
										/>
									</svg>
									Sign out
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
