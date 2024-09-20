"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar as CalendarIcon, Clock, User } from "lucide-react";
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
  id: string;
  date: string;
  time: string;
  name: string;
}

interface TimeSlot {
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

const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await axios.get("/api/appointments");
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};
const fetchWeeklyAppointmentsByDay = async (): Promise<DailyAppointments[]> => {
  try {
    const res = await axios.get("/api/calendar/week");
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

const generateTimeSlots = (
  date: dayjs.Dayjs,
  appointments: Appointment[]
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = dayjs();
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const slotDate = date.hour(hour).minute(minute);
      const appointment = appointments.find(
        (app) => dayjs(app.date).isSame(date, "day") && app.time === time
      );
      slots.push({
        time,
        isAvailable: !appointment,
        isPast: slotDate.isBefore(now),
        appointment,
      });
    }
  }
  return slots;
};

export default function AdminCalendar() {
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
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [appointmentsByDay, setAppointmentsByDay] =
    useState<DailyAppointments[]>();

  useEffect(() => {
    loadAppointments();
    loadWeeklyAppointmentsByDay();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      setError(
        "Falha ao carregar os agendamentos. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeeklyAppointmentsByDay = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeeklyAppointmentsByDay();
      setAppointmentsByDay(data);
    } catch (err) {
      setError(
        "Falha ao carregar os agendamentos. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAppointments(appointments.filter((app) => app.id !== id));
    setIsSlotDialogOpen(false);
    setIsDayDialogOpen(false);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newId = Math.random().toString(36).substr(2, 9);
      setAppointments([...appointments, { id: newId, ...newAppointment }]);
      setIsDialogOpen(false);
      setNewAppointment({ date: "", time: "", name: "" });
    } catch (err) {
      setError("Falha ao criar o agendamento. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTimeSlots = (slots: TimeSlot[]) => {
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
            // onClick={() => {
            //   if (!slot.isPast) {
            //     setSelectedSlot(slot);
            //     setIsSlotDialogOpen(true);
            //   }
            // }}
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
            {renderTimeSlots(day.slots)}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const days = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`border p-2 ${
              !day.isSame(currentDate, "month") ? "bg-gray-100" : ""
            } ${day.isSame(dayjs(), "day") ? "bg-blue-100" : ""}`}
            onClick={() => {
              setSelectedDay(day);
              setIsDayDialogOpen(true);
            }}
          >
            <div className="font-semibold mb-2">{day.format("D")}</div>
            <div className="flex flex-col space-y-1">
              {appointments
                .filter((app) => dayjs(app.date).isSame(day, "day"))
                .map((app) => (
                  <Badge
                    key={app.id}
                    variant="secondary"
                    className="text-xs truncate cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlot({
                        time: app.time,
                        isAvailable: false,
                        isPast: dayjs(`${app.date} ${app.time}`).isBefore(
                          dayjs()
                        ),
                        appointment: app,
                      });
                      setIsSlotDialogOpen(true);
                    }}
                  >
                    {app.time} - {app.name}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Agenda Administrativa
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    viewMode === "week"
                      ? prev.add(1, "week")
                      : prev.add(1, "month")
                  )
                }
              >
                Próximo
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={viewMode}
                onValueChange={(value: "week" | "month") => setViewMode(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione a visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semanal</SelectItem>
                  <SelectItem value="month">Mensal</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Novo Agendamento</Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Agendamento</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleCreateAppointment}
                    className="space-y-4"
                  >
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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
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
              {viewMode === "week" ? renderWeekView() : renderMonthView()}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedSlot?.isAvailable
                ? "Horário Disponível"
                : "Detalhes do Agendamento"}
            </DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4">
              <p>Horário: {selectedSlot.time}</p>
              {selectedSlot.isAvailable ? (
                <div>
                  <p>Este horário está disponível para agendamento.</p>
                  <Button
                    onClick={() => {
                      setNewAppointment({
                        ...newAppointment,
                        date: currentDate.format("YYYY-MM-DD"),
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
                <div>
                  <p>Cliente: {selectedSlot.appointment?.name}</p>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleCancelAppointment(selectedSlot.appointment!.id)
                    }
                    className="mt-2"
                  >
                    Cancelar Agendamento
                  </Button>
                </div>
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
