/**
 * Represents all data needed to add
 * a patient to the DB
 * @author André Santana - fc49451
 */

export class PatientRegisterData {
    constructor(
        public name: string,
        public displayName: string,
        public birthDate: Date,
        public education: string,
        public profileImageURL: string,
        public interests: string,
        public cities: string
    ){}
}
