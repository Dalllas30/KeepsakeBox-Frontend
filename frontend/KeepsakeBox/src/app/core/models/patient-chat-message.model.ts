/**
 * @author André Santana - fc49451
 */

import { SimpleCaregiver } from "./simple-caregiver.model";

export class PatientChatMessage {
    constructor(
        public id: string,
        public createdBy: SimpleCaregiver,
        public message: string,
        public createdDate: Date
    ){}
}
