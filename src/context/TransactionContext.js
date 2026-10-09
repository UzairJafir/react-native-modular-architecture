import React, { createContext, useState, useContext } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [balance, setBalance] = useState(245500);
  const [transactions, setTransactions] = useState([]);

  // 1. Initial State for Active Logged-in User (Dynamic - No Hardcoding)
  const [currentUser, setCurrentUser] = useState(null);

  // 2. Profile Picture Global State (Saves image across screens)
  const [profileImage, setProfileImage] = useState(null);

  // 3. Global Users Database List
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Muhammad Uzair', email: 'uzair@test.com', status: 'Active', balance: 245500 },
    { id: '2', name: 'Jamal Khan', email: 'jamal@example.com', status: 'Active', balance: 120000 },
    { id: '3', name: 'Ali Ahmed', email: 'ali@test.com', status: 'Blocked', balance: 5000 },
  ]);

  // Function to Update Profile Image globally
  const updateProfileImage = (imageUri) => {
    setProfileImage(imageUri);
  };

  // 4. Dynamic User Register / Login Sync
  const registerUserInSystem = (newUserData) => {
    const cleanEmail = (newUserData.email || '').toLowerCase().trim();
    const cleanName = newUserData.name || cleanEmail.split('@')[0];

    // Sets Currently Logged-In User dynamically
    const loggedUser = {
      name: cleanName,
      email: cleanEmail,
      role: cleanEmail === 'admin@finflow.app' ? 'admin' : 'user',
    };

    setCurrentUser(loggedUser);

    // If Admin is logging in, don't add Admin to standard user management list
    if (cleanEmail === 'admin@finflow.app') return;

    setUsersList((prevList) => {
      const exists = prevList.some(
        (u) => u.email.toLowerCase().trim() === cleanEmail
      );

      if (exists) {
        return prevList.map((u) =>
          u.email.toLowerCase().trim() === cleanEmail
            ? { ...u, name: cleanName }
            : u
        );
      }

      // Add New User dynamically to Admin Control List
      return [
        ...prevList,
        {
          id: Date.now().toString(),
          name: cleanName,
          email: cleanEmail,
          status: 'Active', // Default status for new user
          balance: 245500,
        },
      ];
    });
  };

  // 5. Toggle Block / Unblock Status (Admin Only Action)
  const toggleUserStatus = (userId) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' }
          : u
      )
    );
  };

  // 6. Dynamic Block Verification Check
  const isUserBlocked = (userEmail) => {
    const emailToCheck = (userEmail || currentUser?.email || '').toLowerCase().trim();
    if (!emailToCheck) return false;

    const foundUser = usersList.find(
      (u) => u.email.toLowerCase().trim() === emailToCheck
    );

    return foundUser ? foundUser.status === 'Blocked' : false;
  };

  // 7. Core Transaction Engine
  const addTransaction = (newTx) => {
    const numAmount = parseFloat(newTx.amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    if (newTx.type === 'expense') {
      if (numAmount > balance) return false;
      setBalance((prev) => prev - numAmount);
    } else {
      setBalance((prev) => prev + numAmount);
    }

    const transactionData = {
      id: Date.now().toString(),
      ...newTx,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };

    setTransactions((prev) => [transactionData, ...prev]);
    return true;
  };

  const addGoalFunds = (goalTitle, amount) => {
    return addTransaction({
      title: `Goal Savings: ${goalTitle}`,
      category: 'Savings',
      amount: amount,
      type: 'expense',
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        balance,
        transactions,
        setBalance,
        setTransactions,
        addTransaction,
        addGoalFunds,
        currentUser,
        setCurrentUser,
        usersList,
        registerUserInSystem,
        toggleUserStatus,
        isUserBlocked,
        profileImage,
        updateProfileImage,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);