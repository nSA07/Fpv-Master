import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
export async function GET({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    return new NextResponse('File ID missing', { status: 400 });
  }

  const directusFileUrl = `${DIRECTUS_URL}/assets/${id}`;

  try {
    const response = await fetch(directusFileUrl);

    if (!response.ok) {
      return new NextResponse('File not found in Directus', { status: 404 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', 
      },
    });
  } catch (error) {
    console.error('Error fetching image from Directus:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}