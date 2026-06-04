/**
 * Represents all fields needed for a birthDate
 * Used by BirthDateInputComponent
 * @author André Santana - fc49451
 */

export class BirthDate {
    constructor(
        public day: number,
        public month: number,
        public year: number,
        public validDate: boolean
    ){}
}
