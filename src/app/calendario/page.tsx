"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  User,
  CircleUserRound,
  Mail,
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
}

interface TimeSlot {
  date: string;
  time: string;
  isAvailable: boolean;
  isPast: boolean;
  isFree?: boolean;
  appointmentId?: string;
}

interface DailyAppointments {
  date: string;
  slots: TimeSlot[];
}

const fetchWeeklyAppointmentsByDay = async (
  date: string
): Promise<DailyAppointments[]> => {
  try {
    const res = await axios.get("/api/calendar/week", {
      params: { date },
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

const fetchDialogAppointment = async (id: string): Promise<Appointment> => {
  try {
    const res = await axios.get(`/api/appointment/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

const fetchCancelAppointment = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/appointment/${id}`);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export default function AdminCalendar() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    name: "",
  });
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [dialogAppointment, setDialogAppointment] =
    useState<Appointment | null>(null);
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [appointmentsByDay, setAppointmentsByDay] =
    useState<DailyAppointments[]>();

  useEffect(() => {
    loadWeeklyAppointmentsByDay();
  }, [currentDate]);

  const loadWeeklyAppointmentsByDay = useCallback(async () => {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeeklyAppointmentsByDay(formattedDate);
      setAppointmentsByDay(data);
    } catch (err) {
      setError(
        "Falha ao carregar os agendamentos. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    if (!selectedSlot || selectedSlot.isFree) return;
    loadDialogAppointment(selectedSlot.appointmentId || "");
  }, [selectedSlot]);

  const loadDialogAppointment = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDialogAppointment(id);
      setDialogAppointment(data);
    } catch (err) {
      setError(
        "Falha ao carregar os agendamentos. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const doCancelAppointment = useCallback(async () => {
    if (!dialogAppointment) return;
    fetchCancelAppointment(dialogAppointment._id);
  }, [dialogAppointment]);

  const handleCancelAppointment = async () => {
    await doCancelAppointment();
    loadWeeklyAppointmentsByDay();
    setIsSlotDialogOpen(false);
    setIsDayDialogOpen(false);
  };

  const handleCreateAppointment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      try {
        await axios.post("/api/appointment", newAppointment);
        setIsDialogOpen(false);
        setNewAppointment({ date: "", time: "", name: "" });
      } catch (err) {
        setError("Falha ao criar o agendamento. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
        loadWeeklyAppointmentsByDay();
      }
    },
    [newAppointment, loadWeeklyAppointmentsByDay]
  );

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isPast && slot.isFree) return;
    setSelectedSlot(slot);
    setIsSlotDialogOpen(true);
  };

  const renderTimeSlots = (dailyAppointments: DailyAppointments) => {
    const slots = dailyAppointments.slots.map((slot) => ({
      ...slot,
      date: dailyAppointments.date,
    }));

    return (
      <div className="grid grid-cols-2 gap-1">
        {slots.map((slot, index) => (
          <Button
            key={index}
            variant={slot.isFree ? "outline" : "secondary"}
            size="sm"
            className={`text-xs ${
              slot.isPast
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : slot.isFree
                ? "hover:bg-green-100"
                : "bg-blue-100 hover:bg-blue-200"
            }`}
            onClick={() => handleSelectSlot(slot)}
            disabled={slot.isPast}
          >
            {slot.time}
          </Button>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const today = dayjs().format("YYYY-MM-DD");

    if (!appointmentsByDay) {
      return null;
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {appointmentsByDay.map((day) => (
          <div
            key={day.date}
            className={`border p-2 ${day.date === today ? "bg-blue-100" : ""}`}
          >
            <div className="font-semibold mb-2">
              {dayjs(day.date).format("ddd DD/MM")}
            </div>
            {renderTimeSlots(day)}
          </div>
        ))}
      </div>
    );
  };

  const renderToolbar = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() =>
              setCurrentDate((prev) =>
                viewMode === "week"
                  ? prev.subtract(1, "week")
                  : prev.subtract(1, "month")
              )
            }
          >
            Anterior
          </Button>
          <Button onClick={() => setCurrentDate(dayjs())}>Hoje</Button>
          <Button
            onClick={() =>
              setCurrentDate((prev) =>
                viewMode === "week" ? prev.add(1, "week") : prev.add(1, "month")
              )
            }
          >
            Próximo
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Novo Agendamento</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Criar Novo Agendamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          date: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="time">Horário</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          time: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Nome do Cliente</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={newAppointment.name}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          name: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Criando..." : "Criar Agendamento"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  const handleCloseDialog = () => {
    setIsSlotDialogOpen(false);
    setSelectedSlot(null);
    setDialogAppointment(null);
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
            <CardTitle className="text-2xl font-bold">
              Agenda Administrativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {renderToolbar()}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {viewMode === "week"
                  ? `Semana de ${currentDate
                      .startOf("week")
                      .format("DD/MM")} a ${currentDate
                      .endOf("week")
                      .format("DD/MM")}`
                  : currentDate.format("MMMM YYYY")}
              </h2>
              {renderWeekView()}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isSlotDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedSlot?.isFree
                ? "Horário Disponível"
                : "Detalhes do Agendamento"}
            </DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="text-gray-400" />
                <p>{dayjs(selectedSlot.date).format("DD/MM/YYYY")}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="text-gray-400" />
                <p>{selectedSlot?.time}</p>
              </div>

              {!selectedSlot?.appointmentId ? (
                <div>
                  <p>Este horário está disponível para agendamento.</p>
                  <Button
                    onClick={() => {
                      setNewAppointment({
                        ...newAppointment,
                        date: selectedSlot.date,
                        time: selectedSlot.time,
                      });
                      setIsSlotDialogOpen(false);
                      setIsDialogOpen(true);
                    }}
                    className="mt-2"
                  >
                    Agendar
                  </Button>
                </div>
              ) : (
                <>
                  {dialogAppointment?.name && (
                    <div className="flex items-center space-x-2">
                      <CircleUserRound className="text-gray-400" />
                      <p>{dialogAppointment?.name}</p>
                    </div>
                  )}
                  {dialogAppointment?.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="text-gray-400" />
                      <p>{dialogAppointment?.email}</p>
                    </div>
                  )}

                  <Button onClick={handleCancelAppointment} className="mt-2">
                    Cancelar Agendamento
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && selectedDay.format("DD 'de' MMMM")}
            </DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">{renderTimeSlots(selectedDay)}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
