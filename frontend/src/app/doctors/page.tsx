"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Calendar, Clock } from "lucide-react";

interface Doctor {
  id: string;
  cro: string;
  specialty: string;
  photoUrl?: string;
  workSchedule: Record<string, { start: string; end: string }>;
  isActive: boolean;
  user: {
    name: string;
    email: string;
  };
}

export default function DoctorsPage() {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get("/doctors");
      return response.data as Doctor[];
    },
  });

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
      </div>

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

                <Button className="w-full" variant="outline">
                  Ver Agenda Completa
                </Button>
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
