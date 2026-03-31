/**
 * @author André Santana - fc49451
 */

export class CaregiverPatientAssociationData {
    constructor(
        public caregiverId: string,
        public patientId: string,
        public patientRelation: string,
    ){}
}
