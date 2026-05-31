import {
	AnalyticsHeader,
	MetricsCards,
	AnalyticsChart,
	TopAssetsTable,
} from "@/components/analytics";
import {
	metrics,
	volumeData,
	transactionsData,
	topAssets,
} from "@/mock-data/analytics";

export default function AnalyticsPage() {
	return (
		<div className="space-y-8">
			<AnalyticsHeader />

			<MetricsCards metrics={metrics} />

			<div className="grid gap-6 lg:grid-cols-2">
				<AnalyticsChart
					title="Volume Over Time"
					description="Total daily trading volume in USD"
					data={volumeData}
					formatValue={(v) => `$${(v / 1000000).toFixed(1)}M`}
				/>
				<AnalyticsChart
					title="Transactions Over Time"
					description="Total daily transaction count"
					data={transactionsData}
				/>
			</div>

			<TopAssetsTable assets={topAssets} />
		</div>
	);
}
