"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";
import { useWallet } from "@/hooks/useWallet";
import { formatDate } from "@/utils/dateFormatting";

export default function WalletDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { wallet, loading, error, refetch } = useWallet(id);

	if (!loading && error === "not_found") notFound();

	return (
		<div className="min-h-screen bg-zinc-50 p-6 dark:bg-black md:p-12">
			<div className="mx-auto max-w-4xl space-y-8">
				<header className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Wallet Details
						</h1>
						{wallet && (
							<p className="mt-1 text-zinc-500 dark:text-zinc-400">
								{wallet.address}
							</p>
						)}
					</div>
					<Link
						href="/demo/dashboard/wallets"
						className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						← Back to Wallets
					</Link>
				</header>

				{loading && (
					<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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

				{!loading && error && error !== "not_found" && (
					<ErrorState description={error} retry={{ onRetry: refetch }} />
				)}

				{!loading && wallet && (
					<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<dl className="grid gap-6 sm:grid-cols-2">
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Network
								</dt>
								<dd className="mt-1">
									<NetworkBadge network={wallet.network} />
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Status
								</dt>
								<dd className="mt-1">
									<StatusIndicator status={wallet.status} />
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Balance
								</dt>
								<dd className="mt-1 font-mono text-zinc-900 dark:text-zinc-50">
									{wallet.balance ?? "—"}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Created
								</dt>
								<dd className="mt-1 text-zinc-700 dark:text-zinc-300">
									{formatDate(wallet.createdAt)}
								</dd>
							</div>
							{wallet.lastActivity && (
								<div>
									<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
										Last Activity
									</dt>
									<dd className="mt-1 text-zinc-700 dark:text-zinc-300">
										{formatDate(wallet.lastActivity)}
									</dd>
								</div>
							)}
							<div className="sm:col-span-2">
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Address
								</dt>
								<dd className="mt-1">
									<code className="break-all rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
										{wallet.address}
									</code>
								</dd>
							</div>
						</dl>
					</section>
				)}
			</div>
		</div>
	);
}
