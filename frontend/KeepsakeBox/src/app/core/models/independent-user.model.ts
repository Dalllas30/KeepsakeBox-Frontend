/**
 * Independent user — a person with mild cognitive impairment using
 * KeepsakeBox autonomously (no caregiver mediating the session).
 *
 * Mirrors the Caregiver model's shared identity fields, drops caregiver-only
 * fields (type, speciality), and adds an optional primary caregiver link so
 * an independent user can still be associated with a caregiver after the fact
 * (self-register + later assignment, or a patient that was promoted).
 *
 * Secondary/multiple caregiver associations belong in an `independentCaregivers`
 * join collection on the backend, parallel to `patientCaregivers`.
 */

export class IndependentUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public birthDate: Date | null,
    public profileImageURL: string,
    public isActive: boolean,
    public primaryCaregiverId?: string,
  ) {}
}
