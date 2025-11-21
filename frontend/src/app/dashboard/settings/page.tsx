"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, Palette, Building2, Image as ImageIcon, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface SystemConfig {
  clinicName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const DEFAULT_CONFIG: SystemConfig = {
  clinicName: "OdontoX",
  logoUrl: "🦷",
  primaryColor: "#3b82f6",
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
};

export default function SettingsPage() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [previewColor, setPreviewColor] = useState(DEFAULT_CONFIG.primaryColor);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedConfig, setSavedConfig] = useState<SystemConfig>(DEFAULT_CONFIG);

  // Carrega configurações do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("system-config");
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setSavedConfig(parsed);
      setPreviewColor(parsed.primaryColor);
      applyTheme(parsed);
    }
  }, []);

  // Detecta mudanças
  useEffect(() => {
    const changed =
      config.clinicName !== savedConfig.clinicName ||
      config.logoUrl !== savedConfig.logoUrl ||
      config.primaryColor !== savedConfig.primaryColor ||
      config.secondaryColor !== savedConfig.secondaryColor ||
      config.accentColor !== savedConfig.accentColor;
    setHasChanges(changed);
  }, [config, savedConfig]);

  const applyTheme = (cfg: SystemConfig) => {
    // Aplica cores ao documento
    document.documentElement.style.setProperty("--primary", cfg.primaryColor);
    document.documentElement.style.setProperty("--secondary", cfg.secondaryColor);
    document.documentElement.style.setProperty("--accent", cfg.accentColor);

    // Atualiza título da página
    document.title = `${cfg.clinicName} - Sistema de Gestão Odontológica`;
  };

  const handleSave = () => {
    if (!isAdmin) {
      toast({
        title: "Sem permissão",
        description: "Apenas administradores podem alterar as configurações.",
        variant: "destructive",
      });
      return;
    }

    // Log para debug
    console.log("Salvando configurações:", config);

    localStorage.setItem("system-config", JSON.stringify(config));
    setSavedConfig(config);
    setHasChanges(false);
    applyTheme(config);

    toast({
      title: "Configurações salvas!",
      description: "As alterações foram aplicadas ao sistema. Recarregue a página para ver todas as mudanças.",
    });

    // Dispara evento customizado para o layout atualizar
    window.dispatchEvent(new Event("system-config-updated"));
  };

  const handleReset = () => {
    if (!isAdmin) return;

    setConfig(DEFAULT_CONFIG);
    setSavedConfig(DEFAULT_CONFIG);
    setHasChanges(false);
    localStorage.removeItem("system-config");
    applyTheme(DEFAULT_CONFIG);

    toast({
      title: "Configurações restauradas",
      description: "As configurações padrão foram restauradas. Recarregue a página para ver todas as mudanças.",
    });

    // Dispara evento customizado para o layout atualizar
    window.dispatchEvent(new Event("system-config-updated"));
  };

  const presetColors = [
    { name: "Azul", primary: "#3b82f6", secondary: "#8b5cf6", accent: "#06b6d4" },
    { name: "Verde", primary: "#10b981", secondary: "#14b8a6", accent: "#22c55e" },
    { name: "Roxo", primary: "#8b5cf6", secondary: "#a855f7", accent: "#c084fc" },
    { name: "Rosa", primary: "#ec4899", secondary: "#f43f5e", accent: "#fb7185" },
    { name: "Laranja", primary: "#f97316", secondary: "#fb923c", accent: "#fdba74" },
    { name: "Teal", primary: "#14b8a6", secondary: "#2dd4bf", accent: "#5eead4" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="lg"
              disabled={!hasChanges}
              className="text-white hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: hasChanges ? config.primaryColor : "#9ca3af",
                cursor: hasChanges ? "pointer" : "not-allowed",
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {hasChanges ? "Salvar Alterações" : "Sem Alterações"}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              Restaurar Padrão
            </Button>
          </div>
        )}
      </div>

      {hasChanges && isAdmin && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              ⚠️ Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicá-las.
            </p>
          </CardContent>
        </Card>
      )}

      {!isAdmin && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              ⚠️ Apenas administradores podem modificar as configurações do sistema.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Identidade Visual */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Identidade da Clínica</CardTitle>
            </div>
            <CardDescription>Personalize o nome e logo da sua clínica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clinicName">Nome da Clínica</Label>
              <Input
                id="clinicName"
                value={config.clinicName}
                onChange={(e) => setConfig({ ...config, clinicName: e.target.value })}
                placeholder="Nome da sua clínica"
                disabled={!isAdmin}
              />
            </div>

            <div>
              <Label htmlFor="logoUrl">Logo/Emoji</Label>
              <Input
                id="logoUrl"
                value={config.logoUrl}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                placeholder="🦷 ou URL da imagem"
                disabled={!isAdmin}
              />
              <p className="mt-1 text-xs text-muted-foreground">Use um emoji ou cole a URL de uma imagem</p>
            </div>

            <div className="rounded-lg border-2 border-dashed p-4">
              <p className="mb-2 text-sm font-medium">Preview:</p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {config.logoUrl.startsWith("http") ? (
                    <img src={config.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl">{config.logoUrl}</span>
                  )}
                </div>
                <span className="text-xl font-bold">{config.clinicName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cores do Sistema */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Esquema de Cores</CardTitle>
            </div>
            <CardDescription>Personalize as cores do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryColor">Cor Principal</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => {
                    setConfig({ ...config, primaryColor: e.target.value });
                    setPreviewColor(e.target.value);
                  }}
                  className="h-10 w-20"
                  disabled={!isAdmin}
                />
                <Input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="flex-1"
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="h-10 w-20"
                  disabled={!isAdmin}
                />
                <Input
                  type="text"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="flex-1"
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accentColor">Cor de Destaque</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="h-10 w-20"
                  disabled={!isAdmin}
                />
                <Input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="flex-1"
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div>
              <Label>Temas Pré-definidos</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      if (!isAdmin) return;
                      setConfig({
                        ...config,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        accentColor: preset.accent,
                      });
                      setPreviewColor(preset.primary);
                    }}
                    disabled={!isAdmin}
                    className="group relative overflow-hidden rounded-lg border-2 border-gray-200 p-3 text-center transition-all hover:border-gray-400 disabled:opacity-50"
                  >
                    <div className="mb-1 flex justify-center gap-1">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-xs font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview e Ações */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview do Sistema</CardTitle>
          <CardDescription>Visualize como ficará a interface com suas configurações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 p-6" style={{ borderColor: previewColor }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${previewColor}20` }}
                >
                  {config.logoUrl.startsWith("http") ? (
                    <img src={config.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl">{config.logoUrl}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{config.clinicName}</h3>
                  <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
                </div>
              </div>
              <Button style={{ backgroundColor: previewColor }}>Botão Exemplo</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg p-4 text-white" style={{ backgroundColor: config.primaryColor }}>
                <p className="text-sm opacity-90">Cor Principal</p>
                <p className="text-2xl font-bold">100</p>
              </div>
              <div className="rounded-lg p-4 text-white" style={{ backgroundColor: config.secondaryColor }}>
                <p className="text-sm opacity-90">Cor Secundária</p>
                <p className="text-2xl font-bold">50</p>
              </div>
              <div className="rounded-lg p-4 text-white" style={{ backgroundColor: config.accentColor }}>
                <p className="text-sm opacity-90">Cor de Destaque</p>
                <p className="text-2xl font-bold">25</p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-6 flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
              <Button onClick={handleReset} variant="outline">
                Restaurar Padrão
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versão:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usuário Logado:</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Perfil:</span>
              <span className="font-medium">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
