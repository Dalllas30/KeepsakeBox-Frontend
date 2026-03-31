/**
 * @author André Santana - fc49451
 */

import { Patient } from "./patient.model";
import { SimpleCaregiver } from "./simple-caregiver.model";

export class CaregiverNotification {
    constructor(
        public id: string,
        public sender: SimpleCaregiver,
        public receiver: SimpleCaregiver,
        public patient: Patient,
        public messageType: string,
        public createdDate: Date
    ){}
}
