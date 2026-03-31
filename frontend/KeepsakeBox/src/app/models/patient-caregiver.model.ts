/**
 * @author André Santana - fc49451
 */

import { Caregiver } from "./caregiver.model";

export class PatientCaregiver {
    constructor(
        public caregiver: Caregiver,
        public isPrimary: boolean,
        public patientRelation: string
    ){}
}
