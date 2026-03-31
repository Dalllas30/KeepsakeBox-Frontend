/**
 * @author André Santana - fc49451
 */

export class CaregiverPatient {
    constructor(
        public caregiverId: string,
        public patientId: string,
        public isPrimary: boolean,
        public patientRelation: string
    ){}
}
