"use client";

import {
	ArrowDownLeft,
	ArrowUpDown,
	ArrowUpRight,
	ChevronLeft,
	ChevronRight,
	Filter,
	Search,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AnalyticsExportButton } from "@/components/analytics/AnalyticsExportButton";
import { useAnalyticsExport } from "@/hooks/useAnalyticsExport";
import { mockTransactions } from "@/mock-data/analytics";
import { computeAnalyticsSummary } from "@/utils/exportData";
import type { Transaction, TransactionStatus } from "@/types/analytics";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: TransactionStatus }) {
	const styles: Record<TransactionStatus, string> = {
		completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
		pending: "bg-amber-50 text-amber-700 border-amber-100",
		failed: "bg-rose-50 text-rose-700 border-rose-100",
	};
	const dots: Record<TransactionStatus, string> = {
		completed: "bg-emerald-500",
		pending: "bg-amber-500",
		failed: "bg-rose-500",
	};

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dots[status]}`} />
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
}

function SummaryCard({
	label,
	value,
	sub,
	accent,
}: {
	label: string;
	value: string;
	sub?: string;
	accent?: "green" | "red" | "default";
}) {
	const valueColor =
		accent === "green"
			? "text-emerald-600"
			: accent === "red"
				? "text-rose-600"
				: "text-slate-900";

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-1">
			<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
				{label}
			</p>
			<p className={`text-2xl font-bold tabular-nums ${valueColor}`}>{value}</p>
			{sub && <p className="text-xs text-slate-400">{sub}</p>}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 5;

export default function AnalyticsPage() {
	// ---- filter / sort / pagination state ----
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | TransactionStatus>(
		"all",
	);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Transaction;
		direction: "asc" | "desc";
	} | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// ---- derived data ----
	const filteredData = useMemo(() => {
		return mockTransactions.filter((tx) => {
			const matchesSearch =
				tx.description.toLowerCase().includes(search.toLowerCase()) ||
				tx.category.toLowerCase().includes(search.toLowerCase());
			const matchesStatus =
				statusFilter === "all" ? true : tx.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [search, statusFilter]);

	const sortedData = useMemo(() => {
		if (!sortConfig) return filteredData;
		return [...filteredData].sort((a, b) => {
			const aVal = a[sortConfig.key];
			const bVal = b[sortConfig.key];
			if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredData, sortConfig]);

	const totalPages = Math.max(1, Math.ceil(sortedData.length / ITEMS_PER_PAGE));
	const currentData = sortedData.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	// Summary is always computed over the full dataset (not filtered)
	const summary = useMemo(
		() => computeAnalyticsSummary(mockTransactions),
		[],
	);

	// ---- export ----
	// Export respects the current filter so users can export exactly what they see
	const { status: exportStatus, errorMessage, exportAs, reset: resetExport } =
		useAnalyticsExport({ transactions: sortedData });

	// ---- handlers ----
	const handleSort = (key: keyof Transaction) => {
		setSortConfig((prev) => ({
			key,
			direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setSortConfig(null);
		setCurrentPage(1);
	};

	const hasActiveFilters = search.length > 0 || statusFilter !== "all";

	// ---- render ----
	return (
		<div className="space-y-6">
			{/* Page header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
						Analytics
					</h1>
					<p className="text-slate-500 text-sm mt-1">
						Overview of your Mux Protocol transaction activity.
					</p>
				</div>

				<AnalyticsExportButton
					status={exportStatus}
					errorMessage={errorMessage}
					onExport={exportAs}
					onReset={resetExport}
					rowCount={sortedData.length}
				/>
			</div>

			{/* Summary cards */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
				<SummaryCard
					label="Total"
					value={String(summary.totalTransactions)}
					sub="transactions"
				/>
				<SummaryCard
					label="Incoming"
					value={`$${summary.totalIncoming.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
					accent="green"
				/>
				<SummaryCard
					label="Outgoing"
					value={`$${summary.totalOutgoing.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
					accent="red"
				/>
				<SummaryCard
					label="Completed"
					value={String(summary.completedCount)}
					sub="transactions"
				/>
				<SummaryCard
					label="Pending"
					value={String(summary.pendingCount)}
					sub="transactions"
				/>
				<SummaryCard
					label="Failed"
					value={String(summary.failedCount)}
					sub="transactions"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				{/* Search */}
				<div className="relative flex-grow sm:max-w-xs">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={16}
						aria-hidden="true"
					/>
					<input
						type="text"
						placeholder="Search transactions…"
						aria-label="Search transactions"
						className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
					/>
					{search && (
						<button
							type="button"
							onClick={() => {
								setSearch("");
								setCurrentPage(1);
							}}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
							aria-label="Clear search"
						>
							<X size={14} aria-hidden="true" />
						</button>
					)}
				</div>

				{/* Status filter */}
				<div className="relative">
					<Filter
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
						size={16}
						aria-hidden="true"
					/>
					<select
						className="w-full sm:w-40 pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer transition-colors hover:bg-slate-50"
						value={statusFilter}
						aria-label="Filter by status"
						onChange={(e) => {
							setStatusFilter(e.target.value as "all" | TransactionStatus);
							setCurrentPage(1);
						}}
					>
						<option value="all">All Status</option>
						<option value="completed">Completed</option>
						<option value="pending">Pending</option>
						<option value="failed">Failed</option>
					</select>
				</div>

				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="hidden sm:flex items-center justify-center px-3 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
					>
						Reset filters
					</button>
				)}
			</div>

			{/* Table */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
				{/* Column headers */}
				<div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
					<button
						type="button"
						className="col-span-5 pl-2 flex items-center gap-1 cursor-pointer hover:text-indigo-600 text-left"
						onClick={() => handleSort("description")}
					>
						Description
						{sortConfig?.key === "description" && (
							<ArrowUpDown size={12} aria-hidden="true" />
						)}
					</button>
					<div className="col-span-2">Category</div>
					<div className="col-span-2">Status</div>
					<button
						type="button"
						className="col-span-2 text-right flex items-center justify-end gap-1 cursor-pointer hover:text-indigo-600"
						onClick={() => handleSort("amount")}
					>
						Amount
						{sortConfig?.key === "amount" && (
							<ArrowUpDown size={12} aria-hidden="true" />
						)}
					</button>
					<div className="col-span-1" />
				</div>

				{/* Rows */}
				<div className="divide-y divide-slate-100">
					{currentData.length > 0 ? (
						currentData.map((tx) => (
							<div
								key={tx.id}
								className="group md:grid md:grid-cols-12 md:gap-4 p-4 items-center hover:bg-slate-50 transition-colors"
							>
								<div className="col-span-12 md:col-span-5 flex items-center gap-4">
									<div
										className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
											tx.type === "incoming"
												? "bg-emerald-50 border-emerald-100 text-emerald-600"
												: "bg-slate-50 border-slate-200 text-slate-600"
										}`}
										aria-hidden="true"
									>
										{tx.type === "incoming" ? (
											<ArrowDownLeft size={18} />
										) : (
											<ArrowUpRight size={18} />
										)}
									</div>
									<div className="min-w-0">
										<p className="font-medium text-slate-900 truncate">
											{tx.description}
										</p>
										<p className="text-xs text-slate-500 md:hidden">
											{tx.humanDate} · {tx.category}
										</p>
										<p className="hidden md:block text-xs text-slate-500">
											{tx.humanDate}
										</p>
									</div>
								</div>

								<div className="hidden md:block col-span-2 text-sm text-slate-600">
									{tx.category}
								</div>

								<div className="col-span-12 md:col-span-2 mt-3 md:mt-0 flex items-center justify-between md:block">
									<StatusPill status={tx.status} />
									<div className="md:hidden font-semibold tabular-nums text-sm">
										{tx.type === "incoming" ? "+" : "-"}
										{tx.currency}{" "}
										{tx.amount.toLocaleString(undefined, {
											minimumFractionDigits: 2,
										})}
									</div>
								</div>

								<div
									className={`hidden md:block col-span-2 text-right font-semibold tabular-nums text-sm ${
										tx.type === "incoming"
											? "text-emerald-600"
											: "text-slate-900"
									}`}
								>
									{tx.type === "incoming" ? "+" : "-"}
									{tx.currency}{" "}
									{tx.amount.toLocaleString(undefined, {
										minimumFractionDigits: 2,
									})}
								</div>

								<div className="hidden md:block col-span-1" />
							</div>
						))
					) : (
						/* Empty state */
						<div className="p-12 text-center" role="status" aria-live="polite">
							<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
								<Search size={20} className="text-slate-400" aria-hidden="true" />
							</div>
							<h3 className="text-sm font-medium text-slate-900">
								No transactions found
							</h3>
							<p className="text-sm text-slate-500 mt-1">
								{hasActiveFilters
									? "Try adjusting your filters."
									: "No transaction data is available."}
							</p>
							{hasActiveFilters && (
								<button
									type="button"
									onClick={clearFilters}
									className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700"
								>
									Clear all filters
								</button>
							)}
						</div>
					)}
				</div>

				{/* Pagination */}
				{sortedData.length > 0 && (
					<div className="border-t border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
						<span className="text-xs text-slate-500">
							Showing{" "}
							<span className="font-medium text-slate-700">
								{(currentPage - 1) * ITEMS_PER_PAGE + 1}
							</span>{" "}
							to{" "}
							<span className="font-medium text-slate-700">
								{Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)}
							</span>{" "}
							of{" "}
							<span className="font-medium text-slate-700">
								{sortedData.length}
							</span>{" "}
							results
						</span>

						<nav aria-label="Pagination" className="flex items-center gap-1 select-none">
							<button
								type="button"
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								aria-label="Previous page"
								className="p-1.5 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
							>
								<ChevronLeft size={16} aria-hidden="true" />
							</button>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(page) => (
									<button
										key={page}
										type="button"
										onClick={() => handlePageChange(page)}
										aria-label={`Page ${page}`}
										aria-current={currentPage === page ? "page" : undefined}
										className={`w-7 h-7 rounded text-xs font-medium transition-all ${
											currentPage === page
												? "bg-white border border-slate-200 shadow-sm text-indigo-600"
												: "text-slate-600 hover:bg-white hover:shadow-sm"
										}`}
									>
										{page}
									</button>
								),
							)}

							<button
								type="button"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								aria-label="Next page"
								className="p-1.5 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
							>
								<ChevronRight size={16} aria-hidden="true" />
							</button>
						</nav>
					</div>
				)}
			</div>
		</div>
	);
}
