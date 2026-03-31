/**
 * @author André Santana - fc49451
 */

import { PatientChatMessage } from "./patient-chat-message.model";

export class PatientChatMessageList {
    constructor(
        public messages: PatientChatMessage[]
    ){}
}
