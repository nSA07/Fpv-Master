// src/app/api/assets/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const idWithExt = path.replace("/api/assets/", "");
    const cleanId = idWithExt.split(".")[0];

    const directusFileUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${cleanId}`;

    const response = await fetch(directusFileUrl);
    
    if (!response.ok) {
      return new NextResponse('File not found in Directus', { status: 404 });
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = response.headers.get('content-length') ?? undefined;

    const headersInit: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    };
    if (contentLength) {
      headersInit['Content-Length'] = contentLength;
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: headersInit,
    });
  } catch (error) {
    console.error('Error fetching image from Directus:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
