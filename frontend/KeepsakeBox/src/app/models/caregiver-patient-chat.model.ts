/**
 * @author André Santana - fc49451
 */

import { PatientChat } from "./patient-chat.model";

export class CaregiverPatientChat {
    constructor(
        public chat: PatientChat,
        public lastMessageReadDate: Date
    ){}
}
