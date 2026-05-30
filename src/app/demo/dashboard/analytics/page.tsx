import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { requestsOverTime, walletsCreated } from "@/mock-data/analytics";

function formatNumber(value: number) {
	return value.toLocaleString("en-US");
}

export default function page() {
	const totalRequests = requestsOverTime.reduce(
		(sum, item) => sum + item.value,
		0,
	);
	const totalWallets = walletsCreated.reduce(
		(sum, item) => sum + item.value,
		0,
	);

	return (
		<div className="min-h-screen bg-zinc-50 p-6 dark:bg-black md:p-12">
			<div className="mx-auto max-w-7xl space-y-8">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
							Analytics
						</p>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Platform Insights
						</h1>
						<p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
							Monitor request traffic and wallet creation trends for your Mux
							Protocol integration.
						</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-3xl border border-zinc-200 bg-white px-6 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
								Total requests
							</p>
							<p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
								{formatNumber(totalRequests)}
							</p>
						</div>
						<div className="rounded-3xl border border-zinc-200 bg-white px-6 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
								New wallets created
							</p>
							<p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
								{formatNumber(totalWallets)}
							</p>
						</div>
					</div>
				</header>

				<div className="grid gap-6 xl:grid-cols-2">
					<AnalyticsChart
						title="Requests over time"
						description="Shows the total API requests handled by your Mux Protocol integration for the last seven days."
						data={requestsOverTime}
						metric={formatNumber(totalRequests)}
						metricLabel="7-day total"
						lineColor="#2563eb"
						fillColor="#2563eb"
					/>
					<AnalyticsChart
						title="Wallets created"
						description="Tracks the number of new wallets created each day through the Mux SDK."
						data={walletsCreated}
						metric={formatNumber(totalWallets)}
						metricLabel="7-day total"
						lineColor="#14b8a6"
						fillColor="#14b8a6"
					/>
				</div>
			</div>
		</div>
	);
}
