/**
 * @author André Santana - fc49451
 */

export class Caregiver {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public birthDate: Date | null,
    public profileImageURL: string,
    public type: string,
    public speciality: string,
    public isActive: boolean,
  ){}
}
