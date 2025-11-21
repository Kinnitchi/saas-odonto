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
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

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
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Auth Store - Rehydration started");

        if (state) {
          // Verifica se há token salvo
          const token = localStorage.getItem("token");

          console.log("Auth Store - State after rehydration:", {
            hasUser: !!state.user,
            hasToken: !!state.token,
            tokenInLocalStorage: !!token,
            isAuthenticated: state.isAuthenticated,
          });

          // Se há token mas isAuthenticated é false, corrige
          if (state.token && token && !state.isAuthenticated) {
            console.log("Auth Store - Fixing isAuthenticated state");
            state.isAuthenticated = true;
          }

          // Se não há token, garante que está deslogado
          if (!state.token || !token) {
            console.log("Auth Store - No token, clearing auth state");
            state.isAuthenticated = false;
            state.user = null;
          }
        }

        state?.setHasHydrated(true);
        console.log("Auth Store - Rehydration complete");
      },
    },
  ),
);
