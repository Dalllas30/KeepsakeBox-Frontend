/**
 * Represents a request to add a patient to DB
 * and associate to a caregiver
 * @author André Santana - fc49451
 */

import { PatientRegisterData } from "./patient-register-data.model";

export class CaregiverPatientRegisterData {
    constructor(
        public patient: PatientRegisterData,
        public patientRelation: string
    ){}
}
