"use client";

import { useEffect } from "react";

export function ThemeProvider() {
  useEffect(() => {
    // Carrega e aplica as configurações de tema
    const savedConfig = localStorage.getItem("system-config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);

        // Aplica as cores personalizadas
        if (config.primaryColor) {
          // Converte hex para RGB para usar com opacity
          const hex = config.primaryColor.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);

          document.documentElement.style.setProperty("--primary", `${r} ${g} ${b}`);
        }

        // Atualiza o título da página
        if (config.clinicName) {
          document.title = `${config.clinicName} - Sistema de Gestão Odontológica`;
        }
      } catch (error) {
        console.error("Erro ao carregar configurações de tema:", error);
      }
    }
  }, []);

  return null;
}
