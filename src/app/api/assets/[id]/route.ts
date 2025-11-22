import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  if (!fileId) {
    return new NextResponse('File ID missing', { status: 400 });
  }

  const directusFileUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}`;

  try {
    const response = await fetch(directusFileUrl);

    if (!response.ok) {
      return new NextResponse('File not found in Directus', { status: 404 });
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = response.headers.get('content-length') ?? undefined;

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Directus proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
