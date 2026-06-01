"use client";

import { useState } from "react";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { TopAssetsTable } from "@/components/analytics/TopAssetsTable";
import { AnalyticsLoadingSkeleton } from "@/components/analytics/AnalyticsLoadingSkeleton";
import { AnalyticsEmptyState } from "@/components/analytics/AnalyticsEmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAnalyticsMetrics } from "@/hooks/useAnalyticsMetrics";
import type { DateRange } from "@/components/analytics/DateRangePicker";

function defaultRange(): DateRange {
	const to = new Date().toISOString().slice(0, 10);
	const from = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
		.toISOString()
		.slice(0, 10);
	return { from, to };
}

export default function AnalyticsPage() {
	const [range, setRange] = useState<DateRange>(defaultRange);
	const { data, isLoading, isEmpty, isError, error, refetch } =
		useAnalyticsMetrics(range);

	if (isLoading) {
		return <AnalyticsLoadingSkeleton />;
	}

	if (isError) {
		return (
			<ErrorState
				title="Failed to load analytics"
				description={error ?? "An unexpected error occurred. Please try again."}
				retry={{ onRetry: refetch }}
			/>
		);
	}

	if (isEmpty || !data) {
		return (
			<>
				<AnalyticsHeader range={range} onRangeChange={setRange} />
				<AnalyticsEmptyState
					action={{ label: "Refresh", onClick: refetch }}
				/>
			</>
		);
	}

	return (
		<div className="space-y-6">
			<AnalyticsHeader range={range} onRangeChange={setRange} />

			<MetricsCards metrics={data.metrics} />

			<div className="grid gap-6 lg:grid-cols-2">
				<AnalyticsChart
					title="Volume"
					description="Total transaction volume over the selected period"
					data={data.volumeData}
					formatValue={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
				/>
				<AnalyticsChart
					title="Transactions"
					description="Number of transactions over the selected period"
					data={data.transactionsData}
				/>
			</div>

			<TopAssetsTable assets={data.topAssets} />
		</div>
	);
}
