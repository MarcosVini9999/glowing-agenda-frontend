import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("http://localhost:3000/appointments");

  return NextResponse.json(await response.json());
}
