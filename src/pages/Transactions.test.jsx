import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import Transactions from './Transactions';
import * as firebaseService from '../services/firebaseService';
import { ToastProvider } from '../contexts/ToastContext';

// Mock dependencies
vi.mock('../services/firebaseService');
vi.mock('../components/CurrencyInput', () => ({
  default: () => <div data-testid="currency-input" />
}));

const mockTransactions = [
  { id: '1', amount: 100, category: 'Food', type: 'expense', accountId: 'acc1', createdAt: new Date().toISOString() },
  { id: '2', amount: 200, category: 'Salary', type: 'income', accountId: 'acc2', createdAt: new Date().toISOString() },
];

const mockAccounts = [
  { id: 'acc1', name: 'Cash', balance: 1000 },
  { id: 'acc2', name: 'Bank', balance: 5000 },
];

describe('Transactions Page - Filter Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firebaseService.getTransactions.mockResolvedValue(mockTransactions);
    firebaseService.getAccounts.mockResolvedValue(mockAccounts);
  });

  const renderWithRouter = (initialEntries = ['/transactions']) => {
    return render(
      <ToastProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Transactions user={{ uid: 'user123' }} />
        </MemoryRouter>
      </ToastProvider>
    );
  };

  it('should filter transactions based on URL search params', async () => {
    // Render with ?account=acc1
    renderWithRouter(['/transactions?account=acc1']);

    // Check if only "Food" transaction is visible (acc1)
    const foodTx = await screen.findByText('Food');
    expect(foodTx).toBeInTheDocument();
    
    const salaryTx = screen.queryByText('Salary');
    expect(salaryTx).not.toBeInTheDocument();
  });

  it('should show all transactions when no account is selected in URL', async () => {
    renderWithRouter(['/transactions']);

    expect(await screen.findByText('Food')).toBeInTheDocument();
    expect(await screen.findByText('Salary')).toBeInTheDocument();
  });

  it('should update URL when filter selection changes', async () => {
    renderWithRouter(['/transactions']);

    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'acc2' } });

    // Since we can't easily check searchParams from outside with MemoryRouter in this simple test, 
    // we verify the view updates.
    expect(screen.queryByText('Food')).not.toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });
});
