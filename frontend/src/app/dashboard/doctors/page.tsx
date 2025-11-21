"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Calendar, Clock, Plus, Trash2, Edit } from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface Doctor {
  id: string;
  cro: string;
  specialty: string;
  photoUrl?: string;
  workSchedule: Record<string, { start: string; end: string }>;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DoctorsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    cro: "",
    specialty: "",
    workSchedule: {
      monday: { start: "08:00", end: "18:00" },
      tuesday: { start: "08:00", end: "18:00" },
      wednesday: { start: "08:00", end: "18:00" },
      thursday: { start: "08:00", end: "18:00" },
      friday: { start: "08:00", end: "17:00" },
    },
  });

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get("/doctors");
      return response.data as Doctor[];
    },
  });

  const { data: availableUsers } = useQuery({
    queryKey: ["available-users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data as User[];
    },
    enabled: showForm && isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Primeiro cria o usuário se necessário
      if (data.createUser) {
        const userResponse = await api.post("/auth/register", {
          name: data.name,
          email: data.email,
          password: data.password,
          role: "DOCTOR",
        });
        data.userId = userResponse.data.id;
      }

      // Depois cria o perfil de doutor
      return api.post("/doctors", {
        userId: data.userId,
        cro: data.cro,
        specialty: data.specialty,
        workSchedule: data.workSchedule,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Dentista cadastrado com sucesso!",
        description: "O dentista foi adicionado ao sistema.",
      });
      setShowForm(false);
      setFormData({
        userId: "",
        name: "",
        email: "",
        password: "",
        cro: "",
        specialty: "",
        workSchedule: {
          monday: { start: "08:00", end: "18:00" },
          tuesday: { start: "08:00", end: "18:00" },
          wednesday: { start: "08:00", end: "18:00" },
          thursday: { start: "08:00", end: "18:00" },
          friday: { start: "08:00", end: "17:00" },
        },
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar dentista",
        description: error.response?.data?.message || "Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/doctors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Dentista removido",
        description: "O dentista foi removido do sistema.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover dentista",
        description: "Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      createUser: formData.userId === "new",
    };
    createMutation.mutate(submitData);
  };

  const getDayLabel = (day: string) => {
    const days: Record<string, string> = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
      sunday: "Domingo",
    };
    return days[day] || day;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dentistas</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Dentista
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cadastrar Novo Dentista</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Usuário Existente ou Novo</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                >
                  <option value="">Selecione uma opção</option>
                  <option value="new">Criar Novo Usuário</option>
                  {availableUsers
                    ?.filter((u) => u.role === "DOCTOR" && !doctors?.some((d) => d.user.id === u.id))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              {formData.userId === "new" && (
                <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                  <div>
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Senha</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
                <div>
                  <label className="text-sm font-medium">CRO</label>
                  <Input
                    value={formData.cro}
                    onChange={(e) => setFormData({ ...formData, cro: e.target.value })}
                    placeholder="CRO-SP-12345"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Especialidade</label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Ortodontia, Endodontia, etc"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Horário de Trabalho</label>
                <div className="space-y-2">
                  {Object.entries(formData.workSchedule).map(([day, hours]) => (
                    <div key={day} className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-sm">{getDayLabel(day)}</span>
                      <Input
                        type="time"
                        value={hours.start}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workSchedule: {
                              ...formData.workSchedule,
                              [day]: { ...hours, start: e.target.value },
                            },
                          })
                        }
                      />
                      <Input
                        type="time"
                        value={hours.end}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workSchedule: {
                              ...formData.workSchedule,
                              [day]: { ...hours, end: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors?.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {doctor.photoUrl ? (
                    <img src={doctor.photoUrl} alt={doctor.user.name} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <UserCircle className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{doctor.user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground">{doctor.cro}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>Agenda</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {Object.entries(doctor.workSchedule).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between rounded bg-muted px-2 py-1">
                        <span className="text-muted-foreground">{getDayLabel(day)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {hours.start} - {hours.end}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">📧 {doctor.user.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${doctor.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm">{doctor.isActive ? "Ativo" : "Inativo"}</span>
                </div>

                {isAdmin && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button className="flex-1" variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja remover este dentista?")) {
                          deleteMutation.mutate(doctor.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {doctors?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Nenhum dentista cadastrado.</p>
        </div>
      )}
    </div>
  );
}
