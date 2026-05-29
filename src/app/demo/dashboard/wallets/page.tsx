"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddWalletModal } from "@/components/wallet/AddWalletModal";
import { WalletTable } from "@/components/wallet/WalletTable";
import { dummyWallets } from "@/mock-data/wallets";
import type { Wallet } from "@/types/wallet";

export default function WalletsPage() {
	const [wallets, setWallets] = useState<Wallet[]>(dummyWallets);
	const [modalOpen, setModalOpen] = useState(false);

	function handleAddWallet(newWallet: Wallet) {
		setWallets((prev) => [newWallet, ...prev]);
	}

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

				{wallets.length > 0 ? (
					<WalletTable
						wallets={wallets}
						onAddWallet={() => setModalOpen(true)}
					/>
				) : (
					<EmptyState
						title="No wallets found"
						description="You haven't added any wallets to monitor yet. Add your first wallet to start tracking."
						action={{
							label: "Add Wallet",
							onClick: () => setModalOpen(true),
						}}
					/>
				)}
			</div>

			<AddWalletModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onAdd={handleAddWallet}
			/>
		</div>
	);
}
