"use client";

import { useState } from "react";
import {
	AnalyticsHeader,
	MetricsCards,
	AnalyticsChart,
	TopAssetsTable,
	AnalyticsLoadingSkeleton,
	AnalyticsEmptyState,
} from "@/components/analytics";
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
		<div className="space-y-8">
			<AnalyticsHeader range={range} onRangeChange={setRange} />

			<MetricsCards metrics={data.metrics} />

			<div className="grid gap-6 lg:grid-cols-2">
				<AnalyticsChart
					title="Volume Over Time"
					description="Total daily trading volume in USD"
					data={data.volumeData}
					formatValue={(v) => `$${(v / 1000000).toFixed(1)}M`}
				/>
				<AnalyticsChart
					title="Transactions Over Time"
					description="Total daily transaction count"
					data={data.transactionsData}
				/>
			</div>

			<TopAssetsTable assets={data.topAssets} />
		</div>
	);
}
