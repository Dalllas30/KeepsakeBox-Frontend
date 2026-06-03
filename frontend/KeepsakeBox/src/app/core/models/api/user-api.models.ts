/**
 * TypeScript interfaces for the Users Service (FastAPI, port 8000).
 *
 * Account creation happens on Keycloak's own register page. The local profile
 * row is created afterwards by the authenticated onboarding endpoints below
 * (JSON bodies, Bearer token via the Authorization header). Identity fields
 * (name / email / phone / birth_date) come from the JWT claims, not the body.
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
// Onboarding caregiver
// ---------------------------------------------------------------------------

/** Body of POST /users/onboarding/caregiver (Bearer required). */
export interface OnboardingCaregiverRequest {
  role: CaregiverRole;
  caregiver_type_code: string;
  profile_media_id: string | null;
}

/** Response returned by POST /users/onboarding/caregiver. */
export interface OnboardingCaregiverResponse {
  id: string;
  email: string;
  name: string;
  role: CaregiverRole;
  profile_media_id: string | null;
}

// ---------------------------------------------------------------------------
// Onboarding independent user
// ---------------------------------------------------------------------------

/** Body of POST /users/onboarding/independent (Bearer required). */
export interface OnboardingIndependentRequest {
  display_name?: string | null;
  education?: string | null;
  interest_ids: string[];
  profile_media_id: string | null;
}

/** Response returned by POST /users/onboarding/independent. */
export interface OnboardingIndependentResponse {
  id: string;
  email: string;
  name: string;
  display_name?: string | null;
  profile_media_id: string | null;
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
