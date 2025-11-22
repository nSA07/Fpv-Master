import { NextRequest, NextResponse } from 'next/server';

// 💡 Визначення типу для контексту маршруту
// Цей тип має бути більш сумісним з очікуваннями Next.js
interface RouteContext {
  params: {
    id: string;
  };
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

/**
 * Обробник GET-запиту для проксі-завантаження зображення з Directus
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext // ✅ Використовуємо інтерфейс для контексту
) {
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