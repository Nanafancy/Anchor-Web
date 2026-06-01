import { Skeleton } from "@/components/ui/Skeleton";

export function MetricsCardsSkeleton() {
	return (
		<div
			className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
			aria-label="Loading metrics"
			aria-busy="true"
		>
			{Array.from({ length: 4 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
				<div
					key={i}
					className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<Skeleton className="h-4 w-28" />
					<Skeleton className="mt-3 h-8 w-20" />
					<div className="mt-3 flex items-center gap-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
			))}
		</div>
	);
}

export function AnalyticsChartSkeleton() {
	return (
		<div
			className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			aria-label="Loading chart"
			aria-busy="true"
		>
			<div className="mb-6 space-y-2">
				<Skeleton className="h-5 w-40" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="flex items-end gap-1 sm:gap-2" style={{ height: 120 }}>
				{Array.from({ length: 7 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
					<div key={i} className="flex flex-1 flex-col items-center gap-1.5">
						<Skeleton
							className="w-full max-w-[32px] rounded-t-md"
							style={{ height: `${40 + ((i * 17) % 60)}%` }}
						/>
						<Skeleton className="h-3 w-6" />
					</div>
				))}
			</div>
			<div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
	);
}

export function TopAssetsTableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div
			className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
			aria-label="Loading top assets"
			aria-busy="true"
		>
			<div className="space-y-2 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
				<Skeleton className="h-5 w-44" />
				<Skeleton className="h-4 w-56" />
			</div>
			<div className="divide-y divide-zinc-100 dark:divide-zinc-800">
				{Array.from({ length: rows }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
					<div key={i} className="flex items-center gap-4 px-6 py-4">
						<Skeleton className="h-4 w-4 shrink-0" />
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
							<div className="min-w-0 space-y-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-10" />
							</div>
						</div>
						<Skeleton className="ml-auto h-4 w-20" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-14" />
					</div>
				))}
			</div>
		</div>
	);
}

export function AnalyticsLoadingSkeleton() {
	return (
		<div
			className="space-y-6"
			role="status"
			aria-label="Loading analytics data"
			aria-live="polite"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-4 w-72" />
				</div>
				<Skeleton className="h-10 w-48 rounded-lg" />
			</div>
			<MetricsCardsSkeleton />
			<div className="grid gap-6 lg:grid-cols-2">
				<AnalyticsChartSkeleton />
				<AnalyticsChartSkeleton />
			</div>
			<TopAssetsTableSkeleton />
		</div>
	);
}
