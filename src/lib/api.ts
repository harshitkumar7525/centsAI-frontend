/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

interface AuthResponse {
  user_id: number;
  username: string;
  token: string;
}

interface Expense {
  id: number;
  amount: number;
  transactionDate: string;
  category: string;
}

interface TransactionResponse {
  userId: number;
  expenses: Expense[];
}

interface AllTransactionsResponse {
  userId: number;
  allExpenses: Expense[];
}

const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  // Auth
  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Invalid email or password");
    }
    return res.json();
  },

  // Transactions
  async getTransactions(): Promise<AllTransactionsResponse> {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URL}/users/${userId}/transactions`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return res.json();
  },

  async addTransaction(amount: number, category: string, date: string): Promise<TransactionResponse> {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URL}/users/${userId}/transaction`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ amount, category, date }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add transaction");
    }
    return res.json();
  },

  async addTransactionAI(prompt: string): Promise<TransactionResponse> {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URL}/users/ai/${userId}/transaction`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to process AI transaction");
    }
    return res.json();
  },

  async updateTransaction(
    transactionId: number,
    amount: number,
    category: string,
    date: string
  ): Promise<TransactionResponse> {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URL}/users/${userId}/transaction/${transactionId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ amount, category, date }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update transaction");
    }
    return res.json();
  },

  async deleteTransaction(transactionId: number): Promise<void> {
    const userId = getUserId();
    const res = await fetch(`${API_BASE_URL}/users/${userId}/transaction/${transactionId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete transaction");
    }
  },
};

// Decode JWT token to check expiration
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    // If token is malformed, consider it expired
    return true;
  }
}

export const auth = {
  saveAuth(data: AuthResponse) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", String(data.user_id));
    localStorage.setItem("username", data.username);
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  },

  isAuthenticated() {
    const token = getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clear expired token
      this.logout();
      return false;
    }
    
    return true;
  },

  getUsername() {
    return localStorage.getItem("username");
  },

  getUserId() {
    return getUserId();
  },
};

export type { Expense, AuthResponse, TransactionResponse, AllTransactionsResponse };
