import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const videoPath = 'C:\\Users\\fabri\\OneDrive\\Images\\Powalyze _ Le Manifeste.mp4';
    
    if (!existsSync(videoPath)) {
      return new NextResponse('Vidéo non trouvée', { status: 404 });
    }

    const videoBuffer = await readFile(videoPath);
    
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBuffer.length.toString(),
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la lecture de la vidéo:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
