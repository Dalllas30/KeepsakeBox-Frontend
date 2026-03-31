/**
 * All data needed for step 2 of register
 * @author André Santana - fc49451
 */

import { CaregiverType } from "./caregiver-type.model";
import { ProfileImage } from "./profile-image.model";

export class RegisterStep2Data {
    constructor(
        public profileImage: ProfileImage,
        public caregiverType: CaregiverType,
        public submittingRegister: boolean,
        public registered: boolean
    ){}
}
