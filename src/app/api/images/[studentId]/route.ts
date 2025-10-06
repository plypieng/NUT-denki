import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;

    // Check if user is authenticated
    const session = await getServerSession();
    const isAuthenticated = !!session;

    // Get student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { imageUrl: true, fullName: true }
    });

    if (!student?.imageUrl) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // For unauthenticated users, return a placeholder or blurred response
    if (!isAuthenticated) {
      // Return a simple response indicating authentication required
      return new NextResponse(
        `<svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
          <rect width="96" height="96" fill="#f3f4f6"/>
          <text x="48" y="52" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
            ログインが必要です
          </text>
        </svg>`,
        {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache',
            'X-Robots-Tag': 'noindex, noimageindex, noarchive',
          },
        }
      );
    }

    // For authenticated users, proxy the image with noindex headers
    try {
      const imageResponse = await fetch(student.imageUrl);

      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image');
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'X-Robots-Tag': 'noindex, noimageindex, noarchive',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (fetchError) {
      console.error('Image fetch error:', fetchError);
      return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
    }

  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}