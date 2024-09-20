import { API } from "@/lib/API";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }
) {
    const { slug } = params;
    console.log(slug);
    const response = await API.get(`/appointment/${slug}`);
    return NextResponse.json(await response.data);
}
