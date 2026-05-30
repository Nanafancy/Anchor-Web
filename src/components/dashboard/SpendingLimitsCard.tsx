"use client";

import { AlertCircle, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

interface DailyUsage {
	amount: number;
	date: string;
}

function getTodayIsoDate() {
	return new Date().toISOString().slice(0, 10);
}

function clampToNonNegativeNumber(value: number | string) {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function SpendingLimitsCard() {
	const {
		value: dailyLimit,
		setValue: setDailyLimit,
		storageAvailable: dailyLimitStorageAvailable,
		persist: persistDailyLimit,
	} = useLocalStorageState("mux.spending.dailyLimit", "5000");

	const {
		value: transactionLimit,
		setValue: setTransactionLimit,
		storageAvailable: transactionLimitStorageAvailable,
		persist: persistTransactionLimit,
	} = useLocalStorageState("mux.spending.transactionLimit", "1000");

	const {
		value: dailyUsage,
		setValue: setDailyUsage,
		storageAvailable: dailyUsageStorageAvailable,
		persist: persistDailyUsage,
	} = useLocalStorageState<DailyUsage>("mux.spending.dailyUsage", {
		amount: 750,
		date: getTodayIsoDate(),
	});

	const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "failed">("idle");

	const storageAvailable =
		dailyLimitStorageAvailable &&
		transactionLimitStorageAvailable &&
		dailyUsageStorageAvailable;

	useEffect(() => {
		const today = getTodayIsoDate();
		if (dailyUsage.date !== today) {
			setDailyUsage({ amount: 0, date: today });
		}
	}, [dailyUsage, setDailyUsage]);

	const parsedDailyLimit = Number.parseInt(dailyLimit, 10);
	const normalizedDailyLimit = clampToNonNegativeNumber(parsedDailyLimit);
	const validDailyLimit = normalizedDailyLimit && normalizedDailyLimit > 0 ? normalizedDailyLimit : null;
	const validUsageAmount = clampToNonNegativeNumber(dailyUsage?.amount) ?? 0;
	const usagePercentage = validDailyLimit
		? Math.min((validUsageAmount / validDailyLimit) * 100, 100)
		: 0;

	const dailyUsageLabel = validDailyLimit ? `${usagePercentage.toFixed(1)}%` : "N/A";
	const displayDailyLimit = validDailyLimit ? `$${validDailyLimit}` : "—";
	const invalidDailyLimit = dailyLimit === "" || parsedDailyLimit <= 0 || Number.isNaN(parsedDailyLimit);
	const parsedTransactionLimit = Number.parseInt(transactionLimit, 10);
	const invalidTransactionLimit =
		transactionLimit === "" || parsedTransactionLimit <= 0 || Number.isNaN(parsedTransactionLimit);

	const handleSave = () => {
		const dailyLimitSaved = persistDailyLimit();
		const transactionLimitSaved = persistTransactionLimit();
		const dailyUsageSaved = persistDailyUsage();
		const didSave = dailyLimitSaved && transactionLimitSaved && dailyUsageSaved;
		setSaveStatus(didSave ? "saved" : "failed");
		window.setTimeout(() => setSaveStatus("idle"), 2500);
	};

	const noteText = storageAvailable
		? "Your spending limit settings are saved in browser storage for this demo."
		: "Browser storage is unavailable. Settings will not persist and usage may be stale.";

	return (
		<div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
			<div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
						<TrendingUp className="size-5 text-zinc-600 dark:text-zinc-400" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
							Spending Limits
						</h2>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							Control your API expenditure and transaction caps
						</p>
					</div>
				</div>
				<Badge
					variant="outline"
					className="bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
				>
					Active
				</Badge>
			</div>

			<div className="p-6 space-y-8">
				<div className="space-y-3">
					<div className="flex justify-between items-end">
						<div>
							<p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
								Daily Usage
							</p>
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
									${validUsageAmount}
								</span>
								<span className="text-sm text-zinc-500">
									/ {displayDailyLimit}
								</span>
							</div>
						</div>
						<span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
							{dailyUsageLabel}
						</span>
					</div>
					<div
						role="progressbar"
						aria-valuenow={Math.round(usagePercentage)}
						aria-valuemin={0}
						aria-valuemax={100}
						className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden"
					>
						<div
							className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
							style={{ width: `${usagePercentage}%` }}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label
							htmlFor="daily-limit"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
						>
							<DollarSign className="size-4" />
							Daily Spending Limit
						</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
								$
							</span>
							<input
								id="daily-limit"
								type="number"
								value={dailyLimit}
								onChange={(e) => setDailyLimit(e.target.value)}
								className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
								placeholder="0.00"
							/>
						</div>
						<p className="text-xs text-zinc-500">
							Maximum amount you can spend per day.
						</p>
						{invalidDailyLimit ? (
							<p className="text-xs text-rose-600">Invalid daily limit. Enter a value greater than 0.</p>
						) : null}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="tx-limit"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
						>
							<Wallet className="size-4" />
							Per-Transaction Limit
						</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
								$
							</span>
							<input
								id="tx-limit"
								type="number"
								value={transactionLimit}
								onChange={(e) => setTransactionLimit(e.target.value)}
								className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
								placeholder="0.00"
							/>
						</div>
						<p className="text-xs text-zinc-500">
							Maximum cap for a single transaction.
						</p>
						{invalidTransactionLimit ? (
							<p className="text-xs text-rose-600">Invalid transaction limit. Enter a value greater than 0.</p>
						) : null}
					</div>
				</div>

				<div className="flex gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
					<AlertCircle className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />
					<p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
						Spending limits are enforced in real-time. If a transaction exceeds
						your per-transaction limit or if your daily limit is reached,
						subsequent API calls will be restricted until limits are increased
						or the period resets.
					</p>
				</div>
			</div>

			<div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-3">
				<p className="text-xs text-zinc-500 dark:text-zinc-400">{noteText}</p>
				<div className="flex items-center justify-between gap-4">
					<Button className="rounded-full px-6" onClick={handleSave}>
						Save Settings
					</Button>
					{saveStatus === "saved" ? (
						<span className="text-sm text-emerald-600">Settings saved.</span>
					) : saveStatus === "failed" ? (
						<span className="text-sm text-rose-600">Unable to persist settings.</span>
					) : null}
				</div>
			</div>
		</div>
	);
}
