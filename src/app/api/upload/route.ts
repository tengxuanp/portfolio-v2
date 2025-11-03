import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { requireAuthWithResponse } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const postId = formData.get('postId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', postId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      if (file.size === 0) continue;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${originalName}`;
      const filepath = join(uploadsDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      await writeFile(filepath, buffer);

      // Store relative path for database
      uploadedFiles.push(`/uploads/${postId}/${filename}`);
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      message: `Uploaded ${uploadedFiles.length} images`
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json(
        { error: 'Image path is required' },
        { status: 400 }
      );
    }

    // Security: ensure path is within uploads directory
    if (!imagePath.startsWith('/uploads/')) {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 400 }
      );
    }

    const fullPath = join(process.cwd(), 'public', imagePath);
    
    try {
      const { unlink } = await import('fs/promises');
      await unlink(fullPath);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Image deleted successfully' 
      });
    } catch (deleteError) {
      return NextResponse.json(
        { error: 'Image not found or already deleted' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
