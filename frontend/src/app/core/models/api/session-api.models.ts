/**
 * TypeScript interfaces for the Session Management Service (FastAPI, port 8002).
 *
 * Every request must include the `X-Caregiver-ID` header set to the
 * caregiver's `user_id` (from GET /users/me).
 *
 * Auth: Bearer token (Keycloak JWT) via Authorization header.
 */

// ---------------------------------------------------------------------------
// Session creation requests
// ---------------------------------------------------------------------------

/** Create a session automatically (backend selects content). */
export interface AutomaticCreateRequest {
  patient_id: string;
  duration_minutes?: number;
}

/** Create a session from a saved template, optionally customising it. */
export interface SemiAutoCreateRequest {
  patient_id: string;
  template_id: string;
  duration_minutes?: number;
  overrides?: Partial<SessionTemplateOut>;
}

/** Create a fully manual session (caregiver picks every item). */
export interface ManualCreateRequest {
  patient_id: string;
  title: string;
  duration_minutes?: number;
  media_items: SessionMediaItemIn[];
}

export interface SessionMediaItemIn {
  media_id: string;
  order?: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface SessionTemplateOut {
  template_id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  media_items: SessionMediaItemOut[];
  created_at: string;
  updated_at: string;
}

export interface SessionTemplateList {
  items: SessionTemplateOut[];
  total: number;
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export interface SessionOut {
  session_id: string;
  patient_id: string;
  caregiver_id: string;
  title: string;
  status: SessionStatus;
  creation_mode: 'automatic' | 'semi_automatic' | 'manual';
  duration_minutes?: number;
  media_items: SessionMediaItemOut[];
  log?: SessionLogEntry[];
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export type SessionStatus = 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface SessionList {
  items: SessionOut[];
  total: number;
}

// ---------------------------------------------------------------------------
// Session media items
// ---------------------------------------------------------------------------

export interface SessionMediaItemOut {
  item_id: string;
  media_id: string;
  order: number;
  notes?: string;
  /** Pre-signed GET URL, populated when the session is fetched. */
  download_url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

// ---------------------------------------------------------------------------
// Session log
// ---------------------------------------------------------------------------

export interface SessionLogEntry {
  timestamp: string;
  event: string;
  details?: Record<string, unknown>;
}

export interface SessionLogUpdate {
  event: string;
  details?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Session actions
// ---------------------------------------------------------------------------

export interface SessionActionResponse {
  session_id: string;
  status: SessionStatus;
  message?: string;
}
