/**
 * All data needed for step 1 of register
 * @author André Santana - fc49451
 */

import { BirthDate } from "./birth-date.model";
import { UserRole } from "./user-role.model";

export class RegisterStep1Data {
    constructor(
        public name: string,
        public birthDate: BirthDate,
        public email: string,
        public phone: string,
        public password: string,
        public confirmPassword: string,
        // Role selected at the top of step 1. Drives which collection the
        // register call hits and whether the caregiver-type widget is shown
        // in step 2.
        public role: UserRole = 'caregiver',
    ){}
}
