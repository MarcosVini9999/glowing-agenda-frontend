import { API } from "@/lib/API";
import { NextResponse } from "next/server";

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const date = searchParams.get("date");

  const response = await API.get("/calendar/week", {
    params: {
      date
    }
  });

  return NextResponse.json(await response.data);
}
