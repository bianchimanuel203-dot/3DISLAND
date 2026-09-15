const ALLOWED_EXTENSIONS = ['stl', 'obj'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateFileExtension(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
}

export function validateFileSize(bytes: number): boolean {
  return bytes <= MAX_FILE_SIZE;
}

export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  const basename = filename.split(/[\/\\]/).pop() || 'file';
  // Keep only alphanumeric, dots, and hyphens
  return basename.replace(/[^\w.-]/g, '-').slice(0, 200);
}

export function isBinaryStl(bytes: Uint8Array): boolean {
  // STL binario debe tener mínimo 84 bytes (header 80 + triangleCount 4)
  if (bytes.length < 84) return false;

  // NO debe empezar con "solid" (eso es text STL)
  const firstFive = new TextDecoder().decode(bytes.slice(0, 5));
  if (firstFive.toLowerCase() === 'solid') return false;

  // Verificar que el número de triángulos es razonable
  const triangleCount = new DataView(bytes.buffer).getUint32(80, true);
  const expectedSize = 84 + (triangleCount * 50);

  // Permitir +/- 10% de margen por variaciones de formato
  const sizeDiff = Math.abs(bytes.length - expectedSize);
  return sizeDiff < expectedSize * 0.1;
}

export function isTextStl(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false;
  const firstFive = new TextDecoder().decode(bytes.slice(0, 5));
  return firstFive.toLowerCase() === 'solid';
}

export function isValidStl(bytes: Uint8Array): boolean {
  return isTextStl(bytes) || isBinaryStl(bytes);
}

export function isValidObj(bytes: Uint8Array): boolean {
  if (bytes.length < 2) return false;
  const text = new TextDecoder().decode(bytes.slice(0, Math.min(100, bytes.length)));
  // OBJ files typically start with comments (#) or vertex definitions (v )
  return /^#|^v |^g |^o /.test(text.trim());
}

export function validateFileMime(
  filename: string,
  bytes: Uint8Array
): { valid: boolean; error?: string } {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'stl') {
    if (!isValidStl(bytes)) {
      return { valid: false, error: 'Invalid STL file format' };
    }
  } else if (ext === 'obj') {
    if (!isValidObj(bytes)) {
      return { valid: false, error: 'Invalid OBJ file format' };
    }
  }

  return { valid: true };
}

export function generateStoragePath(userId: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(filename);
  return `users/${userId}/${timestamp}-${sanitized}`;
}
