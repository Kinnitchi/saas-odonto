'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [colors, setColors] = useState({
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('system-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setColors({
        primary: parsed.primaryColor || '#3b82f6',
        secondary: parsed.secondaryColor || '#8b5cf6',
        accent: parsed.accentColor || '#06b6d4',
      });
    }
  }, []);

  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const response = await api.get('/dashboard/overview');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Atendimentos Hoje',
      value: overview?.todayAppointments || 0,
      subtitle: `${overview?.scheduledToday || 0} agendados`,
      icon: Calendar,
      color: colors.primary,
    },
    {
      title: 'Em Andamento',
      value: overview?.inProgress || 0,
      subtitle: 'consultas ativas',
      icon: Clock,
      color: colors.secondary,
    },
    {
      title: 'Total Pacientes',
      value: overview?.totalPatients || 0,
      subtitle: 'pacientes ativos',
      icon: Users,
      color: colors.accent,
    },
    {
      title: 'Doutores Ativos',
      value: overview?.activeDoctors || 0,
      subtitle: 'profissionais',
      icon: Activity,
      color: colors.primary,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
          }}
        >
          Dashboard
        </h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className="relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${colors.secondary} 100%)`
                }}
              />
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: stat.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div 
                  className="text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: colors.primary }} />
              Resumo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <span className="text-sm font-medium text-gray-700">Total de atendimentos</span>
              <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                {overview?.totalAppointments || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Sistema funcionando corretamente</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
