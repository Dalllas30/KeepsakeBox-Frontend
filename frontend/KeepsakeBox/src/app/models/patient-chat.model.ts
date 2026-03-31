/**
 * Represents a patient chat
 * @author André Santana - fc49451
 */

export class PatientChat {
    constructor(
        public id: string,
        public lastMessageSentDate: Date,
        public lastMessageReadDate: Date
    ){}
}
