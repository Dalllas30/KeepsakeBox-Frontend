/**
 * All data needed to execute a 
 * caregiver register request
 * @author André Santana - fc49451
 */

export class CaregiverRegisterData {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public password: string,
        public birthDate: Date,
        public profileImageURL: string,
        public type: string,
        public speciality: string
    ){}
}
