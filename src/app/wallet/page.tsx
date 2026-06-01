"use client";

import Link from "next/link";
import React from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateFormatting";
import { isWalletFunded } from "@/utils/walletUtils";

export default function WalletPage() {
	const { wallets, loading, error, refetch } = useWallets();

	const wallet = wallets?.[0] ?? null;

	return (
		<div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-6 md:p-12">
			<div className="max-w-4xl mx-auto space-y-8">
				<header className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-neutral-900">
							Wallet Details
						</h1>
						{wallet ? (
							<p className="text-neutral-500 mt-1">{wallet.address}</p>
						) : (
							<p className="text-neutral-500 mt-1">
								Manage and view your wallet assets
							</p>
						)}
					</div>
					<div className="flex gap-3">
						<Link
							href="/"
							className="px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg shadow-xs hover:bg-neutral-50 transition-colors"
						>
							Back to Dashboard
						</Link>
					</div>
				</header>

				{loading && (
					<section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="grid gap-6 sm:grid-cols-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-5 w-32" />
								</div>
							))}
						</div>
					</section>
				)}

				{!loading && error && (
					<ErrorState description={error} retry={{ onRetry: refetch }} />
				)}

				{!loading && !error && !wallet && (
					<EmptyState
						title="No wallets found"
						description="You haven't added any wallets to monitor yet. Add your first wallet to start tracking."
						action={{ label: "Add Wallet", onClick: () => {} }}
					/>
				)}

				{!loading && wallet && (
					<section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm space-y-6">
						<dl className="grid gap-6 sm:grid-cols-2">
							<div>
								<dt className="text-sm font-medium text-neutral-500">
									Network
								</dt>
								<dd className="mt-1">
									<NetworkBadge network={wallet.network} />
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-neutral-500">Status</dt>
								<dd className="mt-1">
									<StatusIndicator status={wallet.status} />
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-neutral-500">
									Balance
								</dt>
								<dd className="mt-1 font-mono text-neutral-900">
									{wallet.balance ?? "—"}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-neutral-500">
									Created
								</dt>
								<dd className="mt-1 text-neutral-700">
									{formatDate(wallet.createdAt)}
								</dd>
							</div>
							{wallet.lastActivity && (
								<div>
									<dt className="text-sm font-medium text-neutral-500">
										Last Activity
									</dt>
									<dd className="mt-1 text-neutral-700">
										{formatDate(wallet.lastActivity)}
									</dd>
								</div>
							)}
							<div className="sm:col-span-2">
								<dt className="text-sm font-medium text-neutral-500">
									Address
								</dt>
								<dd className="mt-1">
									<code className="break-all rounded bg-neutral-100 px-2 py-1 font-mono text-sm text-neutral-700">
										{wallet.address}
									</code>
								</dd>
							</div>
						</dl>

						<div className="border-t border-neutral-200 pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-neutral-900">
										Send funds from this wallet
									</p>
									<p className="text-sm text-neutral-500 mt-0.5">
										{isWalletFunded(wallet)
											? "Transfer XLM or tokens to another Stellar address"
											: "This wallet has no funds to send"}
									</p>
								</div>
								<Button
									disabled={!isWalletFunded(wallet)}
									title={
										isWalletFunded(wallet)
											? "Send funds from this wallet"
											: "Wallet must be funded to send"
									}
									aria-label={
										isWalletFunded(wallet)
											? "Send funds"
											: "Cannot send: wallet is not funded"
									}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="w-4 h-4"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
										/>
									</svg>
									Send
								</Button>
							</div>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
