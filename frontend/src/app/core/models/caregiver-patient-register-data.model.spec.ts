/**
 * @author André Santana - fc49451
 */
import { CaregiverPatientRegisterData } from './caregiver-patient-register-data.model';
import { PatientRegisterData } from './patient-register-data.model';

describe('CaregiverPatientRegisterData', () => {
  it('should create an instance', () => {
    expect(new CaregiverPatientRegisterData(
      new PatientRegisterData("","",null,null,""),"")).toBeTruthy();
  });
});
