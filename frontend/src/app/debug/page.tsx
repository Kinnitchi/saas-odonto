"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<any>({});
  const authState = useAuthStore();

  useEffect(() => {
    const data = {
      "auth-storage": localStorage.getItem("auth-storage"),
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken"),
      "system-config": localStorage.getItem("system-config"),
    };
    setLocalStorageData(data);
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Debug - Estado da Aplicação</h1>

      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Zustand Auth Store:</h2>
        <pre className="rounded bg-gray-100 p-4 overflow-auto">
          {JSON.stringify(
            {
              isAuthenticated: authState.isAuthenticated,
              _hasHydrated: authState._hasHydrated,
              user: authState.user,
              hasToken: !!authState.token,
              hasRefreshToken: !!authState.refreshToken,
            },
            null,
            2,
          )}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">localStorage:</h2>
        <pre className="rounded bg-gray-100 p-4 overflow-auto">
          {JSON.stringify(
            {
              ...localStorageData,
              "auth-storage-parsed": localStorageData["auth-storage"]
                ? JSON.parse(localStorageData["auth-storage"])
                : null,
            },
            null,
            2,
          )}
        </pre>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Limpar localStorage e Recarregar
        </button>

        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Ir para Login
        </button>

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Ir para Dashboard
        </button>
      </div>
    </div>
  );
}
