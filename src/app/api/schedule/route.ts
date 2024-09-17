import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface ScheduleProps {
  date: string;
  time: string;
  cpf: string;
  name: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ScheduleProps = await req.json();

    const { date, time, cpf, name, email } = body;
    if (!date || !time || !cpf || !name || !email) {
      return NextResponse.json(
        { error: "Todos os campos (data, horário, CPF, nome e e-mail) são obrigatórios." },
        { status: 400 }
      );
    }

    const response = await axios.post("http://localhost:3000/schedule", body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro na requisição:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data || "Erro na requisição ao servidor de agendamentos.";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
