import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WalletPage from "./page";
import type { Wallet } from "@/types/wallet";

const mockWallet: Wallet = {
  id: "w-1",
  address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
  network: "mainnet",
  status: "active",
  createdAt: new Date("2024-01-15T10:30:00Z"),
  balance: "1,250.50 XLM",
};

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("WalletPage", () => {
  it("renders wallet details when wallets exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve([mockWallet]),
        }),
    );

    render(<WalletPage />);

    await waitFor(() =>
      expect(screen.getByText(/Wallet Details/i)).toBeInTheDocument(),
    );

    // Address should be displayed
    expect(screen.getByText(mockWallet.address)).toBeInTheDocument();
    expect(screen.getByText("1,250.50 XLM")).toBeInTheDocument();
  });

  it("shows empty state when no wallets are returned", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }),
    );

    render(<WalletPage />);

    await waitFor(() =>
      expect(screen.getByText(/No wallets found/i)).toBeInTheDocument(),
    );
  });
});
