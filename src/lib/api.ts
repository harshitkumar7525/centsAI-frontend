/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

interface AuthResponse {
  user_id: string;
  username: string;
  token: string;
}

interface Expense {
  id: string;
  amount: number;
  transactionDate: string;
  category: string;
}

interface TransactionResponse {
  userId: string;
  expenses: Expense[];
}

interface AllTransactionsResponse {
  userId: string;
  allExpenses: Expense[];
}

interface ApiMessageResponse {
  message: string;
}

interface ApiValidationErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

const authHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseErrorMessage = async (res: Response, fallbackMessage: string) => {
  try {
    const errorData = (await res.json()) as ApiValidationErrorResponse;

    if (errorData?.errors && Object.keys(errorData.errors).length > 0) {
      const validationMessages = Object.values(errorData.errors).filter(Boolean);
      if (validationMessages.length > 0) {
        return validationMessages.join(" | ");
      }
    }

    return errorData?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export const api = {
  // Auth
  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Registration failed"));
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
      throw new Error(await parseErrorMessage(res, "Invalid email or password"));
    }
    return res.json();
  },

  // Transactions
  async getTransactions(): Promise<AllTransactionsResponse> {
    const userId = getUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const res = await fetch(`${API_BASE_URL}/users/${userId}/transactions`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Failed to fetch transactions"));
    }
    return res.json();
  },

  async addTransaction(amount: number, category?: string, date?: string): Promise<TransactionResponse> {
    const userId = getUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const payload = {
      amount,
      ...(category ? { category } : {}),
      ...(date ? { date } : {}),
    };

    const res = await fetch(`${API_BASE_URL}/users/${userId}/transaction`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Failed to add transaction"));
    }
    return res.json();
  },

  async addTransactionAI(prompt: string): Promise<TransactionResponse> {
    const userId = getUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const res = await fetch(`${API_BASE_URL}/users/ai/${userId}/transaction`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Failed to process AI transaction"));
    }
    return res.json();
  },

  async updateTransaction(
    transactionId: string,
    amount: number,
    category: string,
    date: string
  ): Promise<ApiMessageResponse> {
    const userId = getUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const res = await fetch(`${API_BASE_URL}/users/${userId}/transaction/${transactionId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ amount, category, date }),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Failed to update transaction"));
    }
    return res.json();
  },

  async deleteTransaction(transactionId: string): Promise<ApiMessageResponse> {
    const userId = getUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const res = await fetch(`${API_BASE_URL}/users/${userId}/transaction/${transactionId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error(await parseErrorMessage(res, "Failed to delete transaction"));
    }

    return res.json();
  },
};

// Decode JWT token to check expiration
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    // If token is malformed, consider it expired
    return true;
  }
};

export const auth = {
  saveAuth(data: AuthResponse) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user_id);
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
