import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardOverview } from './DashboardOverview';

describe('DashboardOverview', () => {
	it('renders loading skeleton initially', () => {
		render(<DashboardOverview />);
		expect(screen.getAllByTestId(/skeleton/i)).toBeTruthy();
	});

	it('displays overview stats after loading', async () => {
		render(<DashboardOverview />);
		
		await waitFor(() => {
			expect(screen.getByText('Overview')).toBeInTheDocument();
		});
	});

	it('has a refresh button', async () => {
		render(<DashboardOverview />);
		
		await waitFor(() => {
			const refreshButton = screen.getByText(/refresh/i);
			expect(refreshButton).toBeInTheDocument();
		});
	});

	it('displays stat cards with correct data', async () => {
		render(<DashboardOverview />);
		
		await waitFor(() => {
			expect(screen.getByText('Total Wallets')).toBeInTheDocument();
			expect(screen.getByText('Active Wallets')).toBeInTheDocument();
			expect(screen.getByText('Total Transactions')).toBeInTheDocument();
			expect(screen.getByText('Total Volume')).toBeInTheDocument();
			expect(screen.getByText('API Requests Today')).toBeInTheDocument();
		});
	});
});
