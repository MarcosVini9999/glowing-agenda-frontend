import { API } from "@/lib/API";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await API.get("/available");

  return NextResponse.json(await response.data);
}
