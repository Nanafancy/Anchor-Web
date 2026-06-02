"use client";

import { AlertCircle, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";

interface SpendingLimitsCardProps {
	loading?: boolean;
}

export function SpendingLimitsCard({ loading = false }: SpendingLimitsCardProps) {
	const [dailyLimit, setDailyLimit] = useState("5000");
	const [transactionLimit, setTransactionLimit] = useState("1000");
	const [saveMessage, setSaveMessage] = useState<string | null>(null);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				return;
			}

			const parsed = JSON.parse(stored);
			if (
				typeof parsed?.dailyLimit === "number" &&
				isFinite(parsed.dailyLimit)
			) {
				setDailyLimit(String(parsed.dailyLimit));
			}

			if (
				typeof parsed?.transactionLimit === "number" &&
				isFinite(parsed.transactionLimit)
			) {
				setTransactionLimit(String(parsed.transactionLimit));
			}
		} catch {
			// Ignore invalid stored data and continue with defaults.
		}
	}, []);

	const dailyLimitError = getLimitError(dailyLimit, "Daily spending limit");
	let transactionLimitError = getLimitError(
		transactionLimit,
		"Per-transaction limit",
	);
	const dailyLimitValue = parseLimit(dailyLimit);
	const transactionLimitValue = parseLimit(transactionLimit);

	const toastTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				return;
			}

			const parsed = JSON.parse(stored);
			if (
				typeof parsed?.dailyLimit === "number" &&
				isFinite(parsed.dailyLimit)
			) {
				setDailyLimit(String(parsed.dailyLimit));
			}

			if (
				typeof parsed?.transactionLimit === "number" &&
				isFinite(parsed.transactionLimit)
			) {
				setTransactionLimit(String(parsed.transactionLimit));
			}
		} catch {
			// Ignore invalid stored data and continue with defaults.
		}

		return () => {
			if (toastTimeoutRef.current) {
				window.clearTimeout(toastTimeoutRef.current);
			}
		};
	}, []);

  // Dummy usage data: 750 / 5000 = 15%
  const usedAmount = 750;
  const totalLimit = Number.parseInt(dailyLimit) || 1;
  const usagePercentage = Math.min((usedAmount / totalLimit) * 100, 100);

	if (loading) {
		return <SpendingLimitsCardSkeleton />;
	}

	const handleSave = () => {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				dailyLimit: safeSaveValue(dailyLimit),
				transactionLimit: safeSaveValue(transactionLimit),
			}),
		);

		setToastOpen(true);
		if (toastTimeoutRef.current) {
			window.clearTimeout(toastTimeoutRef.current);
		}

		toastTimeoutRef.current = window.setTimeout(() => {
			setToastOpen(false);
		}, 3000);
	};

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
        {/* Usage Statistics */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Daily Usage
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  ${usedAmount}
                </span>
                <span className="text-sm text-zinc-500">/ ${dailyLimit}</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Limit Input */}
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
          </div>

          {/* Transaction Limit Input */}
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
          </div>
        </div>

        {/* Note/Policy */}
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

      <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
        <Button className="rounded-full px-6">Save Settings</Button>
      </div>
    </div>
  );
}

function SpendingLimitsCardSkeleton() {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
			<div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Skeleton className="h-9 w-9 rounded-lg" />
					<div className="space-y-1.5">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-56" />
					</div>
				</div>
				<Skeleton className="h-5 w-14 rounded-full" />
			</div>

			<div className="p-6 space-y-8">
				<div className="space-y-3">
					<div className="flex justify-between items-end">
						<div className="space-y-1">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-7 w-28" />
						</div>
						<Skeleton className="h-4 w-10" />
					</div>
					<Skeleton className="h-2 w-full rounded-full" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-9 w-full rounded-lg" />
						<Skeleton className="h-3 w-48" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-9 w-full rounded-lg" />
						<Skeleton className="h-3 w-44" />
					</div>
				</div>

				<Skeleton className="h-16 w-full rounded-lg" />
			</div>

			<div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
				<Skeleton className="h-9 w-32 rounded-full" />
			</div>
		</div>
	);
}
