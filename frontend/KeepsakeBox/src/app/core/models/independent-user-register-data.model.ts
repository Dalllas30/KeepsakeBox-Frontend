/**
 * All data needed to execute an independent user register request.
 * Parallel to CaregiverRegisterData, without the caregiver-only fields.
 */

export class IndependentUserRegisterData {
  constructor(
    public name: string,
    public email: string,
    public phone: string,
    public password: string,
    public birthDate: Date,
    public profileImageURL: string,
    public primaryCaregiverId?: string,
  ) {}
}
