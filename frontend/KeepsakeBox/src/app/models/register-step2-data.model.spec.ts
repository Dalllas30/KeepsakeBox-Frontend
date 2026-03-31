/**
 * @author André Santana - fc49451
 */

import { CaregiverType } from './caregiver-type.model';
import { ProfileImage } from './profile-image.model';
import { RegisterStep2Data } from './register-step2-data.model';

describe('RegisterStep2Data', () => {
  it('should create an instance', () => {
    expect(new RegisterStep2Data(new ProfileImage(""),new CaregiverType("",""),false,true)).toBeTruthy();
  });
});
