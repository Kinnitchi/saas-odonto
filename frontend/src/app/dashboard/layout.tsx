"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Calendar, UserCircle, LogOut, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [systemConfig, setSystemConfig] = useState({
    clinicName: "OdontoX",
    logoUrl: "🦷",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#06b6d4",
  });

  useEffect(() => {
    // Carrega configurações do sistema
    const loadConfig = () => {
      const savedConfig = localStorage.getItem("system-config");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setSystemConfig({
          clinicName: parsed.clinicName || "OdontoX",
          logoUrl: parsed.logoUrl || "🦷",
          primaryColor: parsed.primaryColor || "#3b82f6",
          secondaryColor: parsed.secondaryColor || "#8b5cf6",
          accentColor: parsed.accentColor || "#06b6d4",
        });

        // Aplica as cores salvas
        if (parsed.primaryColor) {
          document.documentElement.style.setProperty("--primary", parsed.primaryColor);
        }
        if (parsed.secondaryColor) {
          document.documentElement.style.setProperty("--secondary", parsed.secondaryColor);
        }
        if (parsed.accentColor) {
          document.documentElement.style.setProperty("--accent", parsed.accentColor);
        }
      }
    };

    loadConfig();

    // Escuta atualizações de configuração
    const handleConfigUpdate = () => {
      loadConfig();
    };

    window.addEventListener("system-config-updated", handleConfigUpdate);
    return () => {
      window.removeEventListener("system-config-updated", handleConfigUpdate);
    };
  }, []);

  useEffect(() => {
    // Aguarda a hidratação do store
    if (_hasHydrated) {
      console.log("Dashboard Layout - Hydrated:", {
        isAuthenticated,
        user: user?.email,
        hasRedirected,
      });
      setIsReady(true);

      if (!isAuthenticated && !hasRedirected) {
        console.log("Dashboard Layout - Not authenticated, redirecting to login");
        setHasRedirected(true);
        router.replace("/login");
      }
    }
  }, [_hasHydrated, isAuthenticated, router, hasRedirected]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Mostra loading enquanto hidrata
  if (!isReady || !_hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (o useEffect vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Pacientes",
      href: "/dashboard/patients",
      icon: Users,
      current: pathname === "/dashboard/patients",
    },
    {
      name: "Consultas",
      href: "/dashboard/appointments",
      icon: Calendar,
      current: pathname === "/dashboard/appointments",
    },
    {
      name: "Dentistas",
      href: "/dashboard/doctors",
      icon: UserCircle,
      current: pathname === "/dashboard/doctors",
    },
    {
      name: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header moderno com gradiente */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-8">
              {/* Logo e Nome com destaque */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-gray-50"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${systemConfig.primaryColor} 0%, ${systemConfig.secondaryColor} 100%)`,
                  }}
                >
                  {systemConfig.logoUrl.startsWith("http") ? (
                    <img
                      src={systemConfig.logoUrl}
                      alt={systemConfig.clinicName}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{systemConfig.logoUrl}</span>
                  )}
                </div>
                <span
                  className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${systemConfig.primaryColor} 0%, ${systemConfig.secondaryColor} 100%)`,
                  }}
                >
                  {systemConfig.clinicName}
                </span>
              </Link>

              {/* Menu Desktop - modernizado */}
              <div className="hidden md:flex md:gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <button
                        className={`
                          flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
                          ${item.current ? "text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}
                        `}
                        style={
                          item.current
                            ? {
                                background: `linear-gradient(135deg, ${systemConfig.primaryColor} 0%, ${systemConfig.secondaryColor} 100%)`,
                              }
                            : {}
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Info e Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden rounded-lg bg-gray-50 px-4 py-2 md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs" style={{ color: systemConfig.secondaryColor }}>
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - modernizado */}
      <div className="border-b bg-white shadow-sm md:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`
                      flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all
                      ${item.current ? "text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}
                    `}
                    style={
                      item.current
                        ? {
                            background: `linear-gradient(135deg, ${systemConfig.primaryColor} 0%, ${systemConfig.secondaryColor} 100%)`,
                          }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}
