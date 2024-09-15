import { NextRequest, NextResponse } from "next/server";

interface ScheduleProps {
  date: string;
  time: string;
  cpf: string;
  name: string;
  email: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch("http://localhost:3000/schedule", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json());
}
