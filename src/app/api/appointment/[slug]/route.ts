import { API } from "@/lib/API";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }
) {
    const { slug } = params;
    const response = await API.get(`/appointment/${slug}`);
    return NextResponse.json(await response.data);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }
) {
    const { slug } = params;
    const response = await API.delete(`/appointment/${slug}`);
    return NextResponse.json(await response.data);
}
