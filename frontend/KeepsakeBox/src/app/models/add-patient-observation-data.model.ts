/**
 * @author André Santana - fc49451
 */

export class AddPatientObservationData {
    constructor(
        public patientId: string,
        public caregiverId: string,
        public observation: string
    ){}
}
