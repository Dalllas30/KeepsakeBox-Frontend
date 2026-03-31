/**
 * Represents all patient data
 * @author André Santana - fc49451
 */

import { PatientChat } from "./patient-chat.model";

export class Patient {
    constructor(
        public id: string,
        public name: string,
        public displayName: string,
        public birthDate: Date,
        public education: string,
        public profileImageURL: string,
        public isActive: boolean,
        public lastSession: Date,
        public chat: PatientChat,
        public interests: string,
        public cities: string,
    ){}
}
