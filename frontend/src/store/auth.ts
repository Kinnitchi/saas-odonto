import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  doctor?: {
    id: string;
    cro: string;
    specialty: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken, refreshToken } = response.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
