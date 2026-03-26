import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAccount } from './firebaseService';
import { 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  collection, 
  doc 
} from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  db: {}
}));

// Mock firebase/auth and local firebase utils
vi.mock('../utils/firebase', () => ({
  auth: {},
  db: {}
}));

describe('firebaseService - deleteAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete the account and all its associated transactions', async () => {
    const accountId = 'acc_123';
    
    // Mock snapshot for transactions
    const mockTxDocs = [
      { id: 'tx_1' },
      { id: 'tx_2' }
    ];
    const mockSnapshot = {
      docs: mockTxDocs
    };
    
    getDocs.mockResolvedValueOnce(mockSnapshot);
    deleteDoc.mockResolvedValue(undefined);

    await deleteAccount(accountId);

    // Verify query for transactions
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith('accountId', '==', accountId);
    
    // Verify deleteDoc called for each transaction
    expect(deleteDoc).toHaveBeenCalledTimes(3); // 2 transactions + 1 account
    
    // Check if account deletion was called last (or at least called)
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'accounts', accountId);
  });

  it('should still delete the account if there are no transactions', async () => {
    const accountId = 'acc_empty';
    
    getDocs.mockResolvedValueOnce({ docs: [] });
    deleteDoc.mockResolvedValue(undefined);

    await deleteAccount(accountId);

    // Verify deleteDoc called only once for the account
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'accounts', accountId);
  });
});
