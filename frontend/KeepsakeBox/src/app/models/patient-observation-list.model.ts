/**
 * @author André Santana - fc49451
 */

import { PatientObservation } from "./patient-observation.model";

export class PatientObservationList {
    constructor(
        public observations: PatientObservation[]
    ){}
}
