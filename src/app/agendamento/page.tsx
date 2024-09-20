"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";

interface Slot {
  day: number;
  date: string;
  slots: string[];
}

const fetchSlots = async (): Promise<Slot[]> => {
  try {
    const res = await axios.get("/api/available");
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export default function AgendamentoPage() {
  const [step, setStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [userData, setUserData] = useState({ cpf: "", name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    setIsLoading(true);
    fetchSlots()
      .then(setAvailableSlots)
      .catch((error) => console.error("Erro ao carregar slots:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await axios.post("/api/schedule", {
        ...userData,
        date: selectedDate,
        time: selectedTime,
      });
      setSubmitStatus("success");
    } catch (error) {
      console.error("Erro ao fazer o agendamento:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWeekSelector = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (availableSlots.length === 0) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os horários disponíveis. Por favor, tente
            novamente mais tarde.
          </AlertDescription>
        </Alert>
      );
    }

    const startDate = new Date(availableSlots[0].date + "T00:00:00");
    startDate.setDate(startDate.getDate() + weekOffset * 7);

    const endDate = new Date(availableSlots[6].date + "T00:00:00");
    endDate.setDate(endDate.getDate() + weekOffset * 7);

    const currentWeekSlots = availableSlots.filter((slot) => {
      const slotDate = new Date(slot.date + "T00:00:00");
      return slotDate >= startDate && slotDate <= endDate;
    });

    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            variant="outline"
            disabled={weekOffset === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">
            {startDate.toLocaleDateString("pt-BR")} -{" "}
            {endDate.toLocaleDateString("pt-BR")}
          </span>
          <Button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            variant="outline"
            disabled={weekOffset === 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {currentWeekSlots.map((slot, index) => (
            <Button
              key={index}
              onClick={() => handleDateSelect(slot.date)}
              variant={selectedDate === slot.date ? "default" : "outline"}
              className="h-16 flex flex-col"
              disabled={slot.slots.length === 0}
            >
              <span className="text-xs">
                {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR", {
                  weekday: "short",
                })}
              </span>
              <span className="text-lg">
                {new Date(slot.date + "T00:00:00").getDate()}
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderTimeSelector = () => {
    const selectedSlot = availableSlots.find(
      (slot) => slot.date === selectedDate
    );
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">
          Selecione um horário para{" "}
          {new Date(selectedDate!).toLocaleDateString("pt-BR")}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {selectedSlot?.slots.map((time) => (
            <Button
              key={time}
              onClick={() => handleTimeSelect(time)}
              variant={selectedTime === time ? "default" : "outline"}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderUserForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={userData.cpf}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, cpf: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={userData.email}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {isSubmitting ? "Agendando..." : "Agendar"}
      </Button>
    </form>
  );

  const renderSubmitStatus = () => {
    if (submitStatus === "success") {
      return (
        <Alert className="mt-4">
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            Seu agendamento foi realizado com sucesso para{" "}
            {new Date(selectedDate!).toLocaleDateString("pt-BR")} às{" "}
            {selectedTime}.
          </AlertDescription>
        </Alert>
      );
    } else if (submitStatus === "error") {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao realizar o agendamento. Por favor, tente
            novamente mais tarde.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto z-10 bg-white bg-opacity-90">
        <CardHeader>
          <CardTitle>Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && renderWeekSelector()}
          {step === 2 && renderTimeSelector()}
          {step === 3 && renderUserForm()}
          {renderSubmitStatus()}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              onClick={() => setStep((prev) => prev - 1)}
              variant="outline"
            >
              Voltar
            </Button>
          )}
          {step < 3 && selectedDate && (
            <div className="text-sm">
              Data selecionada:{" "}
              {new Date(selectedDate).toLocaleDateString("pt-BR")}
              {selectedTime && ` às ${selectedTime}`}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
