// TAREA 2.2: Upload Endpoint Usage

/**
 * POST /api/upload/model
 * 
 * Uploads a 3D model file (STL or OBJ) to Supabase Storage and creates a ModelFile record.
 * 
 * AUTHENTICATION: Required (NextAuth session)
 * 
 * REQUEST:
 *   - Content-Type: multipart/form-data
 *   - Field: "file" (File object)
 * 
 * VALIDATION:
 *   - Allowed extensions: .stl, .obj (case-insensitive)
 *   - Max file size: 50MB
 *   - MIME validation: checks magic bytes for correct file format
 *   - Filename: sanitized to prevent path traversal
 * 
 * RESPONSE (201):
 *   {
 *     "success": true,
 *     "modelFileId": "clx1234...",
 *     "filename": "part-name.stl",
 *     "storagePath": "users/{userId}/1234567890-part-name.stl",
 *     "sizeBytes": 524288,
 *     "url": "https://..../files/...",  // Signed URL (expires in 1 hour)
 *     "uploadedAt": "2026-05-25T10:30:00Z"
 *   }
 * 
 * ERROR RESPONSES:
 *   401: Not authenticated
 *   400: Missing file, invalid extension, file too large, invalid MIME type
 *   500: Storage service error, database error
 * 
 * EXAMPLE (JavaScript/TypeScript):
 * 
 *   const formData = new FormData();
 *   formData.append('file', file); // File from <input type="file">
 * 
 *   const response = await fetch('/api/upload/model', {
 *     method: 'POST',
 *     body: formData,
 *   });
 * 
 *   const result = await response.json();
 *   if (result.success) {
 *     console.log('File ID:', result.modelFileId);
 *     console.log('Download URL:', result.url); // Valid for 1 hour
 *   } else {
 *     console.error('Upload failed:', result.error);
 *   }
 * 
 * STORAGE:
 *   - Files stored in private bucket: "model-files"
 *   - Path: users/{userId}/{timestamp}-{sanitized-filename}
 *   - Access: via signed URLs only (RLS enforced)
 * 
 * DATABASE:
 *   - Table: ModelFile
 *   - Fields: id, userId, filename, storagePath, sizeBytes, format, uploadedAt
 * 
 * SECURITY:
 *   - File upload validated server-side (extension + MIME)
 *   - Storage path tied to authenticated user
 *   - RLS policies prevent direct access
 *   - Signed URLs expire in 1 hour to prevent long-lived access
 *   - File deletion rolls back if DB save fails
 */
