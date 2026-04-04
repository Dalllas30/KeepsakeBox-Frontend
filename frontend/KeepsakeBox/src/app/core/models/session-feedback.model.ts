/**
 * @author Pedro Neves - fc46430
 */

export class SessionFeedback {
    constructor(
        public id: string,
        public session_id: string,
        public created_by: string,
        public created_date: Date,
        public patient_feedback: number,
        public anxiety: number,
        public agressivity: number,
        public irritability: number,
        public commitment: number,
        public joy: number,
        public enthusiasm: number,
        public communication: number,
        public apathy: number,
        public patient_agressivity: number,
        public patient_sadness: number,
        public patient_isolation: number,
        public patient_observation: string,
        public duration: number
    ){}
}
