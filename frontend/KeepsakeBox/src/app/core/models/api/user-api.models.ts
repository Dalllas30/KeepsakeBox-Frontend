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

/**
 * Mirrors CaregiverRole in the backend.
 * Keycloak realm roles assigned on registration.
 */
export type CaregiverRole = 'informal_caregiver' | 'formal_caregiver';

/**
 * Maps the frontend informal/formal toggle to a backend caregiver_type_code
 * and the corresponding Keycloak realm role.
 *
 * caregiver_type_code values come from the caregiver_types seed table:
 *   nurse, social_worker (formal) | family_member, volunteer (informal)
 */
export function mapCaregiverType(frontendType: string): {
  caregiver_type_code: string;
  role: CaregiverRole;
} {
  if (frontendType === 'Formal') {
    return { caregiver_type_code: 'nurse', role: 'formal_caregiver' };
  }
  return { caregiver_type_code: 'family_member', role: 'informal_caregiver' };
}

// ---------------------------------------------------------------------------
// Register caregiver
// ---------------------------------------------------------------------------

/** Shape of the `data` field (JSON string) in the caregiver registration form. */
export interface RegisterCaregiverData {
  email: string;
  password: string;
  name: string;
  role: CaregiverRole;
  phone_number?: string;
  birth_date?: string;   // ISO-8601 date string, e.g. "1990-01-15"
  caregiver_type_code: string;
}

/** Response returned by POST /users/register/caregiver */
export interface RegisterCaregiverResponse {
  id: string;
  email: string;
  name: string;
  role: CaregiverRole;
}

// ---------------------------------------------------------------------------
// Register independent user
// ---------------------------------------------------------------------------

/** Shape of the `data` field (JSON string) in the independent registration form. */
export interface RegisterIndependentData {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
  birth_date?: string;
  display_name?: string;
  education?: string;
  interest_ids?: string[];
}

/** Response returned by POST /users/register/independent */
export interface RegisterIndependentResponse {
  id: string;
  email: string;
  name: string;
  display_name?: string;
  interest_ids?: string[];
}

// ---------------------------------------------------------------------------
// GET /users/me
// ---------------------------------------------------------------------------

/**
 * Response from GET /users/me.
 * NOTE: name, email and roles are NOT in this response — read them from the
 * Keycloak JWT claims (sub, name, email, realm_access.roles) instead.
 */
export interface MeResponse {
  user_id: string;            // UUID of the local DB user record
  older_adult_id?: string;    // set when caller is an older adult
  cared_for_pwd_ids: string[]; // UUIDs of PwDs linked to this caregiver
}
