"use client";

import { useState } from "react";

const RANGE_OPTIONS = [
	{ label: "7D", value: "7d" },
	{ label: "30D", value: "30d" },
	{ label: "90D", value: "90d" },
	{ label: "1Y", value: "1y" },
] as const;

export function AnalyticsHeader() {
	const [activeRange, setActiveRange] = useState("7d");

	return (
		<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
					Analytics
				</h1>
				<p className="mt-1 text-zinc-500 dark:text-zinc-400">
					Comprehensive overview of platform metrics, volumes, and trends
				</p>
			</div>

			<div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
				{RANGE_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => setActiveRange(opt.value)}
						className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							activeRange === opt.value
								? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
								: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						}`}
					>
						{opt.label}
					</button>
				))}
			</div>
		</header>
	);
}
