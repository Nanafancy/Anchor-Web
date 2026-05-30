import Link from "next/link";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24">
			<main className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
				{/* Logo / wordmark */}
				<div className="flex flex-col items-center gap-3">
					<span className="text-4xl font-bold tracking-tight text-foreground">
						Mux
					</span>
					<span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
						Protocol
					</span>
				</div>

				{/* Headline */}
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
						The developer console for{" "}
						<span className="text-primary">Invisible Wallets</span>
					</h1>
					<p className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground">
						Manage API keys, track Stellar account creation, and monitor wallet
						activity — without exposing blockchain complexity to your users.
					</p>
				</div>

				{/* CTAs */}
				<div className="flex flex-col gap-3 sm:flex-row">
					<Link
						href="/demo/dashboard"
						className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						Open Dashboard
					</Link>
					<a
						href="https://github.com/muxlabs/mux-frontend"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						View on GitHub
					</a>
				</div>

				{/* Feature pills */}
				<div className="flex flex-wrap justify-center gap-2">
					{[
						"API Key Management",
						"Wallet Tracking",
						"Activity Metrics",
						"Testnet & Mainnet",
					].map((feature) => (
						<span
							key={feature}
							className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
						>
							{feature}
						</span>
					))}
				</div>
			</main>
		</div>
	);
}
