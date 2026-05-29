import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WalletTable } from "@/components/wallet/WalletTable";
import type { Wallet } from "@/types/wallet";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

// Minimal stub — clipboard API not available in jsdom
vi.mock("@/hooks/useCopyToClipboard", () => ({
	useCopyToClipboard: () => ({ copy: vi.fn(), copied: false }),
}));

const wallets: Wallet[] = [
	{
		id: "wallet-001",
		address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
		network: "mainnet",
		status: "active",
		createdAt: new Date("2024-01-15T10:30:00Z"),
		balance: "1,250.50 XLM",
	},
	{
		id: "wallet-002",
		address: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
		network: "testnet",
		status: "pending",
		createdAt: new Date("2024-02-20T08:15:00Z"),
	},
];

describe("WalletTable", () => {
	it("renders a row for each wallet", () => {
		render(<WalletTable wallets={wallets} />);
		expect(screen.getByTestId("wallet-row-wallet-001")).toBeInTheDocument();
		expect(screen.getByTestId("wallet-row-wallet-002")).toBeInTheDocument();
	});

	it("navigates to wallet detail on row click", async () => {
		render(<WalletTable wallets={wallets} />);
		await userEvent.click(screen.getByTestId("wallet-row-wallet-001"));
		expect(mockPush).toHaveBeenCalledWith("/demo/dashboard/wallets/wallet-001");
	});

	it("navigates to the correct wallet for each row", async () => {
		render(<WalletTable wallets={wallets} />);
		await userEvent.click(screen.getByTestId("wallet-row-wallet-002"));
		expect(mockPush).toHaveBeenCalledWith("/demo/dashboard/wallets/wallet-002");
	});

	it("does not navigate when copy button is clicked", async () => {
		mockPush.mockClear();
		render(<WalletTable wallets={wallets} />);
		const copyBtn = screen
			.getByTestId("wallet-row-wallet-001")
			.querySelector("button");
		expect(copyBtn).not.toBeNull();
		await userEvent.click(copyBtn!);
		expect(mockPush).not.toHaveBeenCalled();
	});

	it("renders empty table body when no wallets provided", () => {
		render(<WalletTable wallets={[]} />);
		expect(screen.queryByTestId(/wallet-row/)).toBeNull();
	});
});
