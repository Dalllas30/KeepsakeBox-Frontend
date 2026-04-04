/**
 * @author André Santana - fc49451
 */

export class CaregiverLastMessageRead {
    constructor(
        public caregiverId: string,
        public chatId: string,
        public lastReadDate: Date
    ){}
}
