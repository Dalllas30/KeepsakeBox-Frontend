/**
 * @author André Santana - fc49451
 */

import { CaregiverRegisterData } from './caregiver-register-data.model';

describe('CaregiverRegisterData', () => {
  it('should create an instance', () => {
    expect(new CaregiverRegisterData("","","",new Date(),"","","")).toBeTruthy();
  });
});
