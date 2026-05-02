import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc
} from "firebase/firestore";
import { auth, db } from "../utils/firebase";

// --- AUTH SERVICES ---
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = () => signOut(auth);

// --- ACCOUNTS SERVICES ---
export const getAccounts = async (userId) => {
  const q = query(collection(db, "accounts"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addAccount = async (userId, accountData) => {
  const docRef = await addDoc(collection(db, "accounts"), {
    ...accountData,
    userId,
    balance: Number(accountData.balance || 0),
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...accountData };
};

export const editAccount = async (id, updatedData) => {
  const docRef = doc(db, "accounts", id);
  const cleanData = { ...updatedData };
  if (cleanData.balance !== undefined) cleanData.balance = Number(cleanData.balance);
  await updateDoc(docRef, cleanData);
  return { id, ...updatedData };
};

export const deleteAccount = async (id) => {
  // 1. Delete all transactions associated with this account
  const q = query(collection(db, "transactions"), where("accountId", "==", id));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(txDoc => deleteDoc(doc(db, "transactions", txDoc.id)));
  await Promise.all(deletePromises);

  // 2. Delete the account itself
  const docRef = doc(db, "accounts", id);
  await deleteDoc(docRef);
};

// --- TRANSACTIONS SERVICES ---
export const getTransactions = async (userId) => {
  const q = query(collection(db, "transactions"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
  }));
};

export const addTransaction = async (userId, transaction) => {
  // 1. Add transaction
  const txData = {
    ...transaction,
    userId,
    amount: Number(transaction.amount),
    createdAt: serverTimestamp()
  };
  const txRef = await addDoc(collection(db, "transactions"), txData);

  // 2. Update account balance
  if (transaction.accountId) {
    const accRef = doc(db, "accounts", transaction.accountId);
    const accSnap = await getDoc(accRef);
    if (accSnap.exists()) {
      const currentBalance = Number(accSnap.data().balance || 0);
      const newBalance = transaction.type === 'income' 
        ? currentBalance + Number(transaction.amount)
        : currentBalance - Number(transaction.amount);
      await updateDoc(accRef, { balance: newBalance });
    }
  }
  return { id: txRef.id, ...txData };
};

export const addTransfer = async (userId, { fromAccountId, toAccountId, amount, note }) => {
  const numAmount = Number(amount);

  // Debit source account
  const fromRef = doc(db, "accounts", fromAccountId);
  const fromSnap = await getDoc(fromRef);
  if (!fromSnap.exists()) throw new Error("Tài khoản nguồn không tồn tại.");
  await updateDoc(fromRef, { balance: Number(fromSnap.data().balance) - numAmount });

  // Credit destination account
  const toRef = doc(db, "accounts", toAccountId);
  const toSnap = await getDoc(toRef);
  if (!toSnap.exists()) throw new Error("Tài khoản đích không tồn tại.");
  await updateDoc(toRef, { balance: Number(toSnap.data().balance) + numAmount });

  // Record paired transactions linked by transferId
  const transferId = `transfer_${Date.now()}`;
  const base = { userId, amount: numAmount, category: 'Chuyển khoản', note: note || '', type: 'transfer', transferId, createdAt: serverTimestamp() };
  await addDoc(collection(db, "transactions"), { ...base, accountId: fromAccountId, transferDirection: 'out', toAccountId });
  await addDoc(collection(db, "transactions"), { ...base, accountId: toAccountId, transferDirection: 'in', fromAccountId });
};

export const editTransaction = async (userId, id, updatedData) => {
  const txRef = doc(db, "transactions", id);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) throw new Error("Giao dịch không tồn tại.");

  const oldTx = txSnap.data();
  const newAmount = Number(updatedData.amount);
  const newAccountId = updatedData.accountId || oldTx.accountId;

  // 1. Revert balance của account cũ
  if (oldTx.accountId) {
    const oldAccRef = doc(db, "accounts", oldTx.accountId);
    const oldAccSnap = await getDoc(oldAccRef);
    if (oldAccSnap.exists()) {
      const bal = Number(oldAccSnap.data().balance || 0);
      const reverted = oldTx.type === 'income' ? bal - Number(oldTx.amount) : bal + Number(oldTx.amount);
      await updateDoc(oldAccRef, { balance: reverted });
    }
  }

  // 2. Apply balance mới vào account mới (có thể khác account cũ)
  if (newAccountId) {
    const newAccRef = doc(db, "accounts", newAccountId);
    const newAccSnap = await getDoc(newAccRef);
    if (newAccSnap.exists()) {
      const bal = Number(newAccSnap.data().balance || 0);
      const updated = updatedData.type === 'income' ? bal + newAmount : bal - newAmount;
      await updateDoc(newAccRef, { balance: updated });
    }
  }

  // 3. Update transaction doc (giữ nguyên createdAt)
  const cleanData = {
    type: updatedData.type,
    amount: newAmount,
    category: updatedData.category,
    note: updatedData.note || '',
    accountId: newAccountId,
  };
  await updateDoc(txRef, cleanData);
  return { id, ...cleanData };
};

export const deleteTransaction = async (userId, id) => {
  const txRef = doc(db, "transactions", id);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) return;

  const tx = txSnap.data();

  if (tx.type === 'transfer') {
    // Revert both legs and delete both docs
    const revertBalance = async (accountId, direction) => {
      const accRef = doc(db, "accounts", accountId);
      const accSnap = await getDoc(accRef);
      if (accSnap.exists()) {
        const bal = Number(accSnap.data().balance || 0);
        await updateDoc(accRef, { balance: direction === 'out' ? bal + Number(tx.amount) : bal - Number(tx.amount) });
      }
    };
    await revertBalance(tx.accountId, tx.transferDirection);

    // Delete paired transaction by transferId
    if (tx.transferId) {
      const q = query(collection(db, "transactions"), where("transferId", "==", tx.transferId));
      const snap = await getDocs(q);
      const paired = snap.docs.find(d => d.id !== id);
      if (paired) {
        const pairedTx = paired.data();
        await revertBalance(pairedTx.accountId, pairedTx.transferDirection);
        await deleteDoc(doc(db, "transactions", paired.id));
      }
    }
  } else {
    // income/expense: revert account balance
    if (tx.accountId) {
      const accRef = doc(db, "accounts", tx.accountId);
      const accSnap = await getDoc(accRef);
      if (accSnap.exists()) {
        const bal = Number(accSnap.data().balance || 0);
        const reverted = tx.type === 'income' ? bal - Number(tx.amount) : bal + Number(tx.amount);
        await updateDoc(accRef, { balance: reverted });
      }
    }
  }
  await deleteDoc(txRef);
};

// --- BUDGET SERVICES ---
// Budget doc ID = `${userId}_${categoryId}_${year}_${month}` for easy upsert
export const getBudgets = async (userId, month, year) => {
  const q = query(
    collection(db, "budgets"),
    where("userId", "==", userId),
    where("month", "==", month),
    where("year", "==", year)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const setBudget = async (userId, { categoryId, categoryName, amount, month, year }) => {
  const id = `${userId}_${categoryId}_${year}_${month}`;
  await setDoc(doc(db, "budgets", id), {
    userId, categoryId, categoryName, amount: Number(amount), month, year
  }, { merge: true });
  return { id, userId, categoryId, categoryName, amount: Number(amount), month, year };
};

export const deleteBudget = async (id) => {
  await deleteDoc(doc(db, "budgets", id));
};
