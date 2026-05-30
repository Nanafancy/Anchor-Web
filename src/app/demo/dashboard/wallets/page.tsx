"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { WalletTable } from "@/components/wallet/WalletTable";
import { useWallets } from "@/hooks/useWallets";
import {
createDemoSession,
createExpiredDemoSession,
loadSession,
saveSession,
} from "@/lib/session";

export default function WalletsPage() {
const { wallets, loading, error, refresh } = useWallets();
const [session, setSession] = useState<Record<string, unknown> | null>(null);

useEffect(() => {
setSession(loadSession());
}, []);

const updateSession = (next: Record<string, unknown> | null) => {
saveSession(next);
setSession(loadSession());
};

const isSessionFresh = Boolean(
session &&
typeof session.expiresAt === "number" &&
Number(session.expiresAt) > Date.now(),
);

return (
<div className="min-h-screen bg-zinc-50 p-6 dark:bg-black md:p-12">
<div className="mx-auto max-w-6xl space-y-8">
<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
<div>
<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
Wallet Monitoring
</h1>
<p className="mt-1 text-zinc-500 dark:text-zinc-400">
Track and manage your Stellar wallets with auth-powered query handling.
</p>
</div>
<div className="flex flex-wrap gap-3">
<Link
href="/"
className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
>
Back to Home
</Link>
<button
onClick={() => {
updateSession(createDemoSession());
refresh();
}}
className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
>
Enable Demo Auth
</button>
<button
onClick={() => {
updateSession(createExpiredDemoSession());
refresh();
}}
className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400"
>
Simulate Expired Session
</button>
</div>
</header>

<div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
<p className="text-sm text-zinc-500 dark:text-zinc-400">
Session status: {session ? "saved" : "not configured"}.
</p>
<p className="text-sm text-zinc-500 dark:text-zinc-400">
{isSessionFresh ? "Access token will refresh automatically when expired." : "Load wallet data from an auth-protected API endpoint."}
</p>
</div>

{loading ? (
<div className="space-y-4">
<Skeleton className="h-12 w-1/3" />
<Skeleton className="h-96 w-full" />
</div>
) : error ? (
<ErrorState description={error} retry={{ onRetry: refresh, label: "Reload wallets" }} />
) : wallets.length > 0 ? (
<WalletTable wallets={wallets} />
) : (
<ErrorState description="No wallets were returned from the API." retry={{ onRetry: refresh, label: "Try again" }} />
)}
</div>
</div>
);
}
