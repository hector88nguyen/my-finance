import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword 
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
  getDoc
} from "firebase/firestore";
import { auth, db } from "../utils/firebase";

// --- AUTH SERVICES ---
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
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

export const deleteTransaction = async (userId, id) => {
  const txRef = doc(db, "transactions", id);
  const txSnap = await getDoc(txRef);
  
  if (txSnap.exists()) {
    const tx = txSnap.data();
    // 1. Revert account balance
    if (tx.accountId) {
      const accRef = doc(db, "accounts", tx.accountId);
      const accSnap = await getDoc(accRef);
      if (accSnap.exists()) {
        const currentBalance = Number(accSnap.data().balance || 0);
        const revertedBalance = tx.type === 'income'
          ? currentBalance - Number(tx.amount)
          : currentBalance + Number(tx.amount);
        await updateDoc(accRef, { balance: revertedBalance });
      }
    }
    // 2. Delete doc
    await deleteDoc(txRef);
  }
};
