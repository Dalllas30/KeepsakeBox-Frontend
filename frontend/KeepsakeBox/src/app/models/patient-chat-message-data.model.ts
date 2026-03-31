/**
 * @author André Santana - fc49451
 */

export class PatientChatMessageData {
    constructor(
        public createdById: string,
        public message: string,
        public createdDate: Date
    ){}
}
