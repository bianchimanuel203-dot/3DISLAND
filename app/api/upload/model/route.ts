import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  validateFileExtension,
  validateFileSize,
  validateFileMime,
  generateStoragePath,
} from '@/lib/storage/validation';
import { uploadModelFile, getSignedUrl, deleteModelFile } from '@/lib/storage/client';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // 2. Extract and validate accessToken
    const accessToken = (session as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing access token. Please log out and log in again.' },
        { status: 401 }
      );
    }

    // 3. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // 4. Validate extension
    if (!validateFileExtension(file.name)) {
      return NextResponse.json(
        { success: false, error: 'Only .stl and .obj files are allowed' },
        { status: 400 }
      );
    }

    // 5. Validate file size
    if (!validateFileSize(file.size)) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // 6. Read file buffer and validate MIME
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeValidation = validateFileMime(file.name, new Uint8Array(buffer));

    if (!mimeValidation.valid) {
      return NextResponse.json(
        { success: false, error: mimeValidation.error || 'Invalid file format' },
        { status: 400 }
      );
    }

    // 7. Generate storage path
    const storagePath = generateStoragePath(userId, file.name);

    // 8. Upload to Supabase Storage (with user's accessToken for RLS)
    const uploadResult = await uploadModelFile(accessToken, storagePath, buffer);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // 9. Generate signed URL (1 hour expiration)
    const signedUrlResult = await getSignedUrl(accessToken, storagePath, 3600);

    if (!signedUrlResult.url) {
      // If URL generation fails, delete the uploaded file
      await deleteModelFile(accessToken, storagePath);
      return NextResponse.json(
        { success: false, error: signedUrlResult.error },
        { status: 500 }
      );
    }

    // 10. Create ModelFile record in database
    let modelFile;
    try {
      modelFile = await prisma.modelFile.create({
        data: {
          userId,
          filename: file.name,
          storagePath,
          sizeBytes: file.size,
          format: file.name.split('.').pop()?.toUpperCase() || 'unknown',
        },
      });
    } catch (dbError) {
      // If DB creation fails, delete the uploaded file
      await deleteModelFile(accessToken, storagePath);
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save file metadata' },
        { status: 500 }
      );
    }

    // 11. Return success response
    return NextResponse.json(
      {
        success: true,
        modelFileId: modelFile.id,
        filename: modelFile.filename,
        storagePath: modelFile.storagePath,
        sizeBytes: modelFile.sizeBytes,
        url: signedUrlResult.url,
        uploadedAt: modelFile.uploadedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}