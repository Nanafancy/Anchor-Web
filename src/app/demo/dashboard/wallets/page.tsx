"use client";

import Link from "next/link";
import { useNetwork } from "@/context/NetworkContext";
import { WalletTable } from "@/components/wallet/WalletTable";
import { dummyWallets } from "@/mock-data/wallets";

export default function WalletsPage() {
	const { network } = useNetwork();
	const wallets = dummyWallets.filter((w) => w.network === network);

	return (
		<div className="min-h-screen bg-zinc-50 p-6 dark:bg-black md:p-12">
			<div className="mx-auto max-w-6xl space-y-8">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Wallet Monitoring
						</h1>
						<p className="mt-1 text-zinc-500 dark:text-zinc-400">
							Track and manage your Stellar wallets
						</p>
					</div>
					<div className="flex gap-3">
						<Link
							href="/"
							className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
						>
							Back to Home
						</Link>
					</div>
				</header>

				<WalletTable wallets={wallets} />
			</div>
		</div>
	);
}
