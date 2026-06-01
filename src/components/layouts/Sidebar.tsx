"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navigation = [
	{ name: "Dashboard", href: "/dashboard" },
	{ name: "Analytics", href: "/dashboard/analytics" },
	{ name: "Wallets", href: "/dashboard/wallets" },
	{ name: "Users", href: "/dashboard/users" },
	{ name: "Orders", href: "/dashboard/orders" },
	{ name: "Settings", href: "/dashboard/settings" },
];

function isNavItemActive(pathname: string, itemHref: string): boolean {
	if (pathname === itemHref) return true;
	if (itemHref === "/dashboard") return pathname === "/dashboard";
	return pathname.startsWith(`${itemHref}/`) || pathname.startsWith(itemHref);
}

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname();
	const { user, isLoading, signOut } = useAuth();

	/** Handle logout: call signOut from AuthContext (issue #45). */
	function handleLogout() {
		onClose();
		signOut();
	}

	return (
		<>
			{/* Mobile Sidebar */}
			<div
				className={[
					"fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
					"lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
					isOpen ? "translate-x-0" : "-translate-x-full",
				].join(" ")}
			>
				<div className="flex h-full flex-col bg-white shadow-xl lg:shadow-none border-r">
					{/* Logo Section */}
					<div className="flex h-16 items-center justify-between px-6 border-b">
						<div className="flex items-center space-x-3">
							<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
							<span className="text-xl font-bold text-gray-900">Dashboard</span>
						</div>

						{/* Close button — mobile only */}
						<button
							type="button"
							onClick={onClose}
							className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 lg:hidden"
						>
							<span className="sr-only">Close sidebar</span>
							{/* ✕ icon via SVG — no external icon library needed */}
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
						{navigation.map((item) => {
							const isActive = isNavItemActive(pathname, item.href);
							return (
								<Link
									key={item.name}
									href={item.href}
									className={[
										"group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
										isActive
											? "bg-blue-50 text-blue-700 border border-blue-200"
											: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
									].join(" ")}
									onClick={() => {
										if (typeof window !== "undefined" && window.innerWidth < 1024) {
											onClose();
										}
									}}
								>
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* User Profile + Logout (issue #45) */}
					<div className="border-t p-4 space-y-3">
						{isLoading ? (
							<div className="flex items-center space-x-3">
								<div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
								<div className="flex-1 space-y-2">
									<div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
									<div className="h-2 w-16 rounded bg-gray-200 animate-pulse" />
								</div>
							</div>
						) : user ? (
							<>
								<div className="flex items-center space-x-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
										{user.name
											.split(" ")
											.map((n) => n[0])
											.slice(0, 2)
											.join("")
											.toUpperCase()}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{user.name}
										</p>
										<p className="text-xs text-gray-500 truncate">{user.role}</p>
									</div>
								</div>

								{/* Logout button (issue #45) */}
								<button
									type="button"
									onClick={handleLogout}
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
									data-testid="sidebar-logout-button"
								>
									{/* Arrow-right-on-rectangle icon via inline SVG */}
									<svg
										className="h-4 w-4 shrink-0"
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
							</>
						) : (
							<div className="flex items-center space-x-3">
								<div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-500 truncate">
										Not signed in
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
