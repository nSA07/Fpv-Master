import { NextRequest, NextResponse } from "next/server";

// Базовий URL вашого Directus
const DIRECTUS_URL = process.env.DIRECTUS_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  if (!fileId) {
    return new NextResponse('File ID missing', { status: 400 });
  }

  const directusFileUrl = `${DIRECTUS_URL}/assets/${fileId}`;

  try {
    // 1. Next.js робить запит до Directus на сервері
    const response = await fetch(directusFileUrl);

    if (!response.ok) {
      // Якщо Directus не віддав файл
      return new NextResponse('File not found in Directus', { status: 404 });
    }

    // 2. Отримуємо вміст файлу та тип контенту
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBlob = await response.blob();
    
    // 3. Next.js віддає файл клієнту (Googlebot'у)
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Обов'язково для кешування та швидкості:
        'Cache-Control': 'public, max-age=31536000, immutable', 
      },
    });
  } catch (error) {
    console.error('Error fetching image from Directus:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}