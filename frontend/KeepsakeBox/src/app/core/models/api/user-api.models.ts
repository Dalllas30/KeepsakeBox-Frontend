/**
 * TypeScript interfaces for the Users Service (FastAPI, port 8000).
 *
 * Registration uses multipart/form-data:
 *   - `data`            : JSON-serialised string containing the fields below
 *   - `profile_picture` : optional File / Blob
 *
 * Auth: Bearer token (Keycloak JWT) via Authorization header.
 */

// ---------------------------------------------------------------------------
// Enums / literals
// ---------------------------------------------------------------------------

/** Mirrors the CaregiverRole enum on the backend. */
export type CaregiverRole = 'Formal' | 'Informal';

// ---------------------------------------------------------------------------
// Register caregiver
// ---------------------------------------------------------------------------

/** Shape of the `data` field (JSON string) in the caregiver registration form. */
export interface RegisterCaregiverData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  birth_date?: string;   // ISO-8601 date string, e.g. "1990-01-15"
  caregiver_type?: CaregiverRole;
  speciality?: string;
}

/** Full response returned by POST /users/register/caregiver */
export interface RegisterCaregiverResponse {
  user_id: string;
  email: string;
  name: string;
  caregiver_type?: CaregiverRole;
  speciality?: string;
  profile_picture_url?: string;
}

// ---------------------------------------------------------------------------
// Register independent user
// ---------------------------------------------------------------------------

/** Shape of the `data` field (JSON string) in the independent registration form. */
export interface RegisterIndependentData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  birth_date?: string;
  display_name?: string;
  interest_ids?: string[];
  primary_caregiver_id?: string;
}

/** Full response returned by POST /users/register/independent */
export interface RegisterIndependentResponse {
  user_id: string;
  email: string;
  name: string;
  display_name?: string;
  profile_picture_url?: string;
}

// ---------------------------------------------------------------------------
// GET /users/me
// ---------------------------------------------------------------------------

/** Response from GET /users/me — the currently authenticated user. */
export interface MeResponse {
  user_id: string;
  email: string;
  name: string;
  roles: string[];             // realm roles from Keycloak, e.g. ["caregiver"]
  caregiver_type?: CaregiverRole;
  speciality?: string;
  display_name?: string;
  profile_picture_url?: string;
  phone?: string;
  birth_date?: string;
}
