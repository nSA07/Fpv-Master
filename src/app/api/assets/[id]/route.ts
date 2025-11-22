import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

// 🔥 Якщо хочеш, щоб Next.js ніколи не кешував на сервері — додай:
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: RouteContext) {
  const fileId = params.id;

  if (!fileId) {
    return new NextResponse('File ID missing', { status: 400 });
  }

  const directusFileUrl = `${DIRECTUS_URL}/assets/${fileId}`;

  try {
    const response = await fetch(directusFileUrl);

    if (!response.ok) {
      return new NextResponse('File not found in Directus', { status: 404 });
    }

    // Найкраще — стрім-форвардинг
    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = response.headers.get('content-length') ?? undefined;

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching image from Directus:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
