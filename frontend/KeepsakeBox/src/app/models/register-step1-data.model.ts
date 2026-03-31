/**
 * All data needed for step 1 of register
 * @author André Santana - fc49451
 */

import { BirthDate } from "./birth-date.model";

export class RegisterStep1Data {
    constructor(
        public name: string,
        public birthDate: BirthDate,
        public email: string,
        public phone: string,
        public password: string,
        public confirmPassword: string,
    ){}
}
