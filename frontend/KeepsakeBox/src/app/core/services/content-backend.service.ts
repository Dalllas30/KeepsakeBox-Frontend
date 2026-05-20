/**
 * Angular service wrapping the Content Service (FastAPI, port 8001).
 *
 * Two-phase upload flow
 * ---------------------
 * 1. Call presign()  → receives a pre-signed MinIO PUT URL and an object key.
 * 2. PUT the file directly to MinIO using the upload URL (no Angular HTTP — use fetch or XMLHttpRequest).
 * 3. Call completeUpload() with the object key to register the media record.
 *
 * Read flow
 * ---------
 * - listPersonalMedia()   : list all media items for the current user (optional context filter)
 * - getPersonalMedia()    : get a single media item by ID
 * - getDownloadUrls()     : bulk-resolve pre-signed GET URLs for a set of object keys
 *
 * The Bearer token is attached automatically by auth.interceptor.ts.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PresignContext,
  PresignResponse,
  CompleteUploadRequest,
  CompleteUploadResponse,
  PersonalMediaOut,
  PersonalMediaList,
  DownloadUrlsRequest,
  DownloadUrlsResponse,
} from '../models/api/content-api.models';

@Injectable({
  providedIn: 'root'
})
export class ContentBackendService {

  private readonly base = environment.contentServiceUrl;

  constructor(private http: HttpClient) {}

  // --------------------------------------------------------------------------
  // Presign
  // --------------------------------------------------------------------------

  /**
   * Request a pre-signed upload URL from MinIO via the Content Service.
   *
   * @param request  Context-specific presign request (LSB or caregiver gallery).
   */
  presign(request: PresignContext): Observable<PresignResponse> {
    return this.http.post<PresignResponse>(`${this.base}/content/presign`, request);
  }

  // --------------------------------------------------------------------------
  // Direct browser upload to MinIO
  // --------------------------------------------------------------------------

  /**
   * Upload a file directly to MinIO using the pre-signed URL returned by presign().
   *
   * This bypasses Angular's HttpClient intentionally — MinIO expects a raw PUT
   * request and the response is empty (no body); wrapping it in HttpClient adds
   * unnecessary overhead and can cause issues with progress events.
   *
   * @param uploadUrl   The pre-signed PUT URL from PresignResponse.upload_url.
   * @param file        The file to upload.
   * @param onProgress  Optional callback receiving upload progress 0–100.
   */
  uploadToMinio(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Observable<void> {
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      if (onProgress) {
        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          observer.next();
          observer.complete();
        } else {
          observer.error(new Error(`MinIO upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => observer.error(new Error('MinIO upload network error'));
      xhr.send(file);
    });
  }

  // --------------------------------------------------------------------------
  // Complete upload
  // --------------------------------------------------------------------------

  /**
   * After the file has been successfully uploaded to MinIO, call this to
   * create the media record in the database.
   */
  completeUpload(request: CompleteUploadRequest): Observable<CompleteUploadResponse> {
    return this.http.post<CompleteUploadResponse>(`${this.base}/content/complete`, request);
  }

  // --------------------------------------------------------------------------
  // Convenience: presign + upload + complete in one call
  // --------------------------------------------------------------------------

  /**
   * High-level helper: presigns, uploads the file to MinIO, then completes.
   * Emits the final CompleteUploadResponse on success.
   *
   * @param presignRequest   The presign context (determines bucket/path).
   * @param file             The file to upload.
   * @param metadata         Optional title/description/tags for the media record.
   * @param onProgress       Optional upload progress callback (0–100).
   */
  upload(
    presignRequest: PresignContext,
    file: File,
    metadata?: { title?: string; description?: string; tags?: string[] },
    onProgress?: (percent: number) => void
  ): Observable<CompleteUploadResponse> {
    return this.presign(presignRequest).pipe(
      switchMap(({ upload_url, object_key }) =>
        this.uploadToMinio(upload_url, file, onProgress).pipe(
          switchMap(() =>
            this.completeUpload({
              object_key,
              context: presignRequest.context,
              patient_id: (presignRequest as any).patient_id,
              ...metadata,
            })
          )
        )
      )
    );
  }

  // --------------------------------------------------------------------------
  // List / get personal media
  // --------------------------------------------------------------------------

  /**
   * List all personal media items for the current user.
   *
   * @param context  Optional filter: 'life_story_book' | 'caregiver_gallery'.
   * @param skip     Pagination offset (default 0).
   * @param limit    Page size (default 20).
   */
  listPersonalMedia(
    context?: 'life_story_book' | 'caregiver_gallery',
    skip = 0,
    limit = 20
  ): Observable<PersonalMediaList> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
    if (context) {
      params = params.set('context', context);
    }
    return this.http.get<PersonalMediaList>(`${this.base}/content/media`, { params });
  }

  /**
   * Get a single personal media item by its ID.
   */
  getPersonalMedia(mediaId: string): Observable<PersonalMediaOut> {
    return this.http.get<PersonalMediaOut>(`${this.base}/content/media/${mediaId}`);
  }

  // --------------------------------------------------------------------------
  // Download URLs
  // --------------------------------------------------------------------------

  /**
   * Resolve pre-signed GET URLs for a batch of object keys.
   * Returns a map from object_key to pre-signed URL.
   */
  getDownloadUrls(objectKeys: string[]): Observable<DownloadUrlsResponse> {
    const request: DownloadUrlsRequest = { object_keys: objectKeys };
    return this.http.post<DownloadUrlsResponse>(`${this.base}/content/download-urls`, request);
  }
}
