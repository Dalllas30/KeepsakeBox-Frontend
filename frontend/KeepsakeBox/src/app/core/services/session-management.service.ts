/**
 * Angular service wrapping the Session Management Service (FastAPI, port 8002).
 *
 * This service replaces template-session.service.ts and rt-session.service.ts.
 *
 * Every request must include:
 *   - Authorization: Bearer <token>  — set by auth.interceptor.ts
 *   - X-Caregiver-ID: <user_id>      — set by caregiver-id.interceptor.ts
 *
 * Session creation modes
 * ----------------------
 *   automatic    — backend selects content based on patient profile
 *   semi_auto    — start from a saved template, optionally customise
 *   manual       — caregiver picks every media item
 *
 * Typical session lifecycle
 * -------------------------
 *   createAutomatic() / createSemiAuto() / createManual()
 *     → startSession()
 *       → pauseSession() / resumeSession()  (optional)
 *     → endSession()
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AutomaticCreateRequest,
  SemiAutoCreateRequest,
  ManualCreateRequest,
  SessionTemplateOut,
  SessionTemplateList,
  SessionOut,
  SessionList,
  SessionLogUpdate,
  SessionActionResponse,
} from '../models/api/session-api.models';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {

  private readonly base = environment.sessionServiceUrl;

  constructor(private http: HttpClient) {}

  // --------------------------------------------------------------------------
  // Templates
  // --------------------------------------------------------------------------

  /** List all session templates visible to the current caregiver. */
  listTemplates(skip = 0, limit = 20): Observable<SessionTemplateList> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<SessionTemplateList>(`${this.base}/sessions/templates`, { params });
  }

  /** Get a single template by ID. */
  getTemplate(templateId: string): Observable<SessionTemplateOut> {
    return this.http.get<SessionTemplateOut>(`${this.base}/sessions/templates/${templateId}`);
  }

  // --------------------------------------------------------------------------
  // Create sessions
  // --------------------------------------------------------------------------

  /** Create a session automatically (backend selects content). */
  createAutomatic(request: AutomaticCreateRequest): Observable<SessionOut> {
    return this.http.post<SessionOut>(`${this.base}/sessions/automatic`, request);
  }

  /** Create a session from a saved template with optional overrides. */
  createSemiAuto(request: SemiAutoCreateRequest): Observable<SessionOut> {
    return this.http.post<SessionOut>(`${this.base}/sessions/semi-automatic`, request);
  }

  /** Create a fully manual session where the caregiver picks every item. */
  createManual(request: ManualCreateRequest): Observable<SessionOut> {
    return this.http.post<SessionOut>(`${this.base}/sessions/manual`, request);
  }

  // --------------------------------------------------------------------------
  // Retrieve sessions
  // --------------------------------------------------------------------------

  /**
   * List sessions for the current caregiver, optionally filtered by patient.
   *
   * @param patientId  Optional patient filter.
   * @param status     Optional status filter.
   * @param skip       Pagination offset.
   * @param limit      Page size.
   */
  listSessions(
    patientId?: string,
    status?: string,
    skip = 0,
    limit = 20
  ): Observable<SessionList> {
    let params = new HttpParams().set('skip', skip).set('limit', limit);
    if (patientId) params = params.set('patient_id', patientId);
    if (status)    params = params.set('status', status);
    return this.http.get<SessionList>(`${this.base}/sessions`, { params });
  }

  /** Get a single session by ID. */
  getSession(sessionId: string): Observable<SessionOut> {
    return this.http.get<SessionOut>(`${this.base}/sessions/${sessionId}`);
  }

  // --------------------------------------------------------------------------
  // Session lifecycle actions
  // --------------------------------------------------------------------------

  /** Transition a pending session to active (starts the timer). */
  startSession(sessionId: string): Observable<SessionActionResponse> {
    return this.http.post<SessionActionResponse>(`${this.base}/sessions/${sessionId}/start`, {});
  }

  /** Pause an active session. */
  pauseSession(sessionId: string): Observable<SessionActionResponse> {
    return this.http.post<SessionActionResponse>(`${this.base}/sessions/${sessionId}/pause`, {});
  }

  /** Resume a paused session. */
  resumeSession(sessionId: string): Observable<SessionActionResponse> {
    return this.http.post<SessionActionResponse>(`${this.base}/sessions/${sessionId}/resume`, {});
  }

  /** End an active or paused session. */
  endSession(sessionId: string): Observable<SessionActionResponse> {
    return this.http.post<SessionActionResponse>(`${this.base}/sessions/${sessionId}/end`, {});
  }

  /** Cancel a session before it starts. */
  cancelSession(sessionId: string): Observable<SessionActionResponse> {
    return this.http.post<SessionActionResponse>(`${this.base}/sessions/${sessionId}/cancel`, {});
  }

  // --------------------------------------------------------------------------
  // Session log
  // --------------------------------------------------------------------------

  /**
   * Append a log entry to a session (e.g. "caregiver noted patient smiled").
   */
  appendLog(sessionId: string, entry: SessionLogUpdate): Observable<SessionOut> {
    return this.http.post<SessionOut>(`${this.base}/sessions/${sessionId}/log`, entry);
  }
}
