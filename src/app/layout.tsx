import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://muxprotocol.com"),
	title: {
		default: "Mux Protocol",
		template: "%s | Mux Protocol",
	},
	description:
		"Mux Protocol — a modular, non-custodial DeFi platform for cross-chain liquidity, leveraged trading, and yield optimization.",
	keywords: [
		"Mux Protocol",
		"DeFi",
		"cross-chain",
		"liquidity",
		"leveraged trading",
		"yield optimization",
		"non-custodial",
	],
	authors: [{ name: "Mux Labs" }],
	creator: "Mux Labs",
	publisher: "Mux Labs",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://muxprotocol.com",
		siteName: "Mux Protocol",
		title: "Mux Protocol",
		description:
			"Mux Protocol — a modular, non-custodial DeFi platform for cross-chain liquidity, leveraged trading, and yield optimization.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Mux Protocol",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@MuxProtocol",
		creator: "@MuxProtocol",
		title: "Mux Protocol",
		description:
			"Mux Protocol — a modular, non-custodial DeFi platform for cross-chain liquidity, leveraged trading, and yield optimization.",
		images: ["/og-image.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
