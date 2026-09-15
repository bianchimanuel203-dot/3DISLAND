import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export function createUserSupabaseClient(accessToken: string) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}

const BUCKET_NAME = 'model-files';

export async function uploadModelFile(
  accessToken: string,
  storagePath: string,
  fileBuffer: Buffer
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createUserSupabaseClient(accessToken);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload file to storage' };
    }

    return { success: true };
  } catch (err) {
    console.error('Upload exception:', err);
    return { success: false, error: 'Storage service error' };
  }
}

export async function getSignedUrl(
  accessToken: string,
  storagePath: string,
  expiresIn: number = 3600
): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = createUserSupabaseClient(accessToken);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      return { error: 'Failed to generate signed URL' };
    }

    return { url: data.signedUrl };
  } catch (err) {
    console.error('Signed URL exception:', err);
    return { error: 'Storage service error' };
  }
}

export async function deleteModelFile(
  accessToken: string,
  storagePath: string
): Promise<void> {
  try {
    const supabase = createUserSupabaseClient(accessToken);
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
  } catch (err) {
    console.error('Delete error:', err);
  }
}
