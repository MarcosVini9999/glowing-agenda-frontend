"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  IdCard,
  CircleUserRound,
  Mail,
  CircleArrowLeft,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("pt-br");

interface Appointment {
  _id: string;
  date: string;
  time: string;
  name: string;
  email: string | null;
  cpf: string | null;
}

const fetchSearchAppointments = async (
  search: string
): Promise<Appointment[]> => {
  try {
    const res = await axios.get("/api/appointment", {
      params: { search },
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export default function PesquisaCalendario() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchString, setSearchString] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [searchString]);

  const loadAppointments = useCallback(async () => {
    try {
      const data = await fetchSearchAppointments(searchString || "");
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, [searchString]);

  const renderAppointments = () => {
    const today = dayjs().format("YYYY-MM-DD");

    if (!appointments) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.date}
            className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md min-w-[300px] max-w-[400px] shadow"
          >
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-gray-400" />
              <p>{dayjs(appointment.date).format("DD/MM/YYYY")}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="text-gray-400" />
              <p>{appointment.time}</p>
            </div>

            <div className="flex items-center space-x-2">
              <CircleUserRound className="text-gray-400" />
              <p>{appointment?.name}</p>
            </div>

            {appointment?.email && (
              <div className="flex items-center space-x-2">
                <Mail className="text-gray-400" />
                <p>{appointment?.email}</p>
              </div>
            )}

            {appointment?.cpf && (
              <div className="flex items-center space-x-2">
                <IdCard className="text-gray-400" />
                <p>{appointment?.cpf}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderToolbar = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="min-w-[600px]"
        />
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button onClick={() => router.push("/login")}>Logout</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center">
              <a
                onClick={() => router.push("/calendario")}
                className="cursor-pointer flex items-center justify-center mr-2"
              >
                <CircleArrowLeft />
              </a>

              <CardTitle className="text-2xl font-bold">
                Agenda Administrativa
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div>{renderToolbar()}</div>
            <div>{renderAppointments()}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
