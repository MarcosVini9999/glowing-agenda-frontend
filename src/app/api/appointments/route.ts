import { API } from "@/lib/API";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await API.get("/appointments");

  return NextResponse.json(await response.data);
}
