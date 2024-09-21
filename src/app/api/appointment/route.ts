import { API } from "@/lib/API";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await API.post(`/appointment`, body); // Send parsed body to Axios
    return NextResponse.json(response.data); // Return the response as JSON
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
