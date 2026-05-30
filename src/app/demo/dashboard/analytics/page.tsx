"use client";

import { BarChart2, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { DateRangePicker, type DateRange } from "@/components/analytics/DateRangePicker";
import { TransactionVolumeChart } from "@/components/analytics/TransactionVolumeChart";
import { dailyTransactionVolume } from "@/mock-data/transaction-volume";

const MAX_DATE = "2026-05-30";
const DEFAULT_RANGE: DateRange = { from: "2026-03-01", to: MAX_DATE };

type Metric = "count" | "volume";

export default function AnalyticsPage() {
	const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
	const [metric, setMetric] = useState<Metric>("count");

	const filtered = useMemo(
		() =>
			dailyTransactionVolume.filter(
				(d) => d.date >= range.from && d.date <= range.to,
			),
		[range],
	);

	const totalCount = useMemo(
		() => filtered.reduce((s, d) => s + d.count, 0),
		[filtered],
	);
	const totalVolume = useMemo(
		() => filtered.reduce((s, d) => s + d.volume, 0),
		[filtered],
	);
	const avgCount =
		filtered.length > 0 ? Math.round(totalCount / filtered.length) : 0;

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						Analytics
					</h1>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Transaction volume and activity over time
					</p>
				</div>
				<DateRangePicker
					value={range}
					onChange={setRange}
					maxDate={MAX_DATE}
				/>
			</div>

			{/* Summary cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<SummaryCard
					label="Total Transactions"
					value={totalCount.toLocaleString()}
					icon={<BarChart2 className="size-5 text-blue-500" />}
				/>
				<SummaryCard
					label="Total Volume"
					value={`${Math.round(totalVolume).toLocaleString()} XLM`}
					icon={<TrendingUp className="size-5 text-emerald-500" />}
				/>
				<SummaryCard
					label="Avg / Day"
					value={`${avgCount} txns`}
					icon={<BarChart2 className="size-5 text-violet-500" />}
				/>
			</div>

			{/* Chart card */}
			<div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
				<div className="flex flex-col gap-3 border-b border-zinc-100 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
						Transaction Volume
					</h2>
					{/* Metric toggle */}
					<div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden text-sm">
						{(["count", "volume"] as Metric[]).map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setMetric(m)}
								className={`px-4 py-1.5 font-medium transition-colors ${
									metric === m
										? "bg-blue-600 text-white"
										: "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
								}`}
							>
								{m === "count" ? "Tx Count" : "Volume (XLM)"}
							</button>
						))}
					</div>
				</div>
				<div className="p-5">
					{filtered.length === 0 ? (
						<p className="py-16 text-center text-sm text-zinc-400">
							No data for the selected range.
						</p>
					) : (
						<TransactionVolumeChart data={filtered} metric={metric} />
					)}
				</div>
			</div>
		</div>
	);
}

function SummaryCard({
	label,
	value,
	icon,
}: { label: string; value: string; icon: React.ReactNode }) {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
			<div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-900">
				{icon}
			</div>
			<div>
				<p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
				<p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
					{value}
				</p>
			</div>
		</div>
	);
}
