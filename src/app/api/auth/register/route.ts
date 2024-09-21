import { API } from "@/lib/API";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await API.post(`/auth/register`, body);
    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
