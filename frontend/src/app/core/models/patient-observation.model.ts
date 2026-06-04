/**
 * @author André Santana - fc49451
 */

import { SimpleCaregiver } from "./simple-caregiver.model";

export class PatientObservation {
    constructor(
        public id: string,
        public patientId: string,
        public caregiver: SimpleCaregiver,
        public observation: string,
        public lastUpdatedDate: Date | null
    ){}
}
