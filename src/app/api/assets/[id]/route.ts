import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest, context: any ) {
  const { params } = context;
  const fileId = params.id;

  if (!fileId) {
    return new NextResponse('File ID missing', { status: 400 });
  }

  const directusUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}`;

  try {
    const directusResponse = await fetch(directusUrl);

    if (!directusResponse.ok) {
      return new NextResponse('File not found', { status: 404 });
    }

    const headers = new Headers(directusResponse.headers);

    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(directusResponse.body, {
      status: 200,
      headers,
    });

  } catch (err) {
    console.error(err);
    return new NextResponse('Server error', { status: 500 });
  }
}
