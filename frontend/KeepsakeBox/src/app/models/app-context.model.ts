/**
 * @author Pedro Neves - fc46430
 */

export class AppContext {
    constructor(
        public routingBack: string,
        public templateSessionId: string,
        public patientContext: boolean,
        public patientId: string,
        public editing: boolean
    ){}
}
