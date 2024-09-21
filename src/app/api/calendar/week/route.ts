import { API } from "@/lib/API";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const response = await API.get("/calendar/week", {
    params: {
      date
    }
  });

  return NextResponse.json(await response.data);
}
