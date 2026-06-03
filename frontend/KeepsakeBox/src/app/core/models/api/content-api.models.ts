/**
 * TypeScript interfaces for the Content Service (FastAPI, port 8001).
 *
 * Two-phase MinIO upload:
 *   1. POST /content/presign  → PresignResponse (upload_url + object_key)
 *   2. PUT <upload_url>       → direct browser upload to MinIO
 *   3. POST /content/complete → CompleteUploadResponse (confirmed media record)
 *
 * Auth: Bearer token (Keycloak JWT) via Authorization header.
 */

// ---------------------------------------------------------------------------
// Presign — request shapes
// ---------------------------------------------------------------------------

/** Discriminated union for presign context. */
export type PresignContext = LsbPresignRequest | CaregiverGalleryPresignRequest;

/** Presign a Life Story Book image upload. */
export interface LsbPresignRequest {
  context: 'life_story_book';
  patient_id: string;
  filename: string;
  content_type: string;
}

/** Presign a Caregiver Gallery image upload. */
export interface CaregiverGalleryPresignRequest {
  context: 'caregiver_gallery';
  filename: string;
  content_type: string;
}

// ---------------------------------------------------------------------------
// Presign — response
// ---------------------------------------------------------------------------

export interface PresignResponse {
  upload_url: string;    // pre-signed PUT URL pointing directly at MinIO
  object_key: string;    // opaque key to pass back in the complete call
}

// ---------------------------------------------------------------------------
// Complete upload
// ---------------------------------------------------------------------------

export interface CompleteUploadRequest {
  object_key: string;
  context: 'life_story_book' | 'caregiver_gallery';
  patient_id?: string;   // required when context === 'life_story_book'
  title?: string;
  description?: string;
  tags?: string[];
}

export interface CompleteUploadResponse {
  media_id: string;
  object_key: string;
  context: 'life_story_book' | 'caregiver_gallery';
  title?: string;
  description?: string;
  tags?: string[];
  created_at: string;    // ISO-8601
}

// ---------------------------------------------------------------------------
// Personal media
// ---------------------------------------------------------------------------

/** A single media item. The `context` field drives which extra fields are set. */
export interface PersonalMediaOut {
  media_id: string;
  object_key: string;
  context: 'life_story_book' | 'caregiver_gallery';
  title?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  /** Only present when context === 'life_story_book' */
  patient_id?: string;
}

export interface PersonalMediaList {
  items: PersonalMediaOut[];
  total: number;
}

// ---------------------------------------------------------------------------
// Download URLs
// ---------------------------------------------------------------------------

export interface DownloadUrlsRequest {
  object_keys: string[];
}

export interface DownloadUrlsResponse {
  /** Map from object_key to pre-signed GET URL */
  urls: Record<string, string>;
}
