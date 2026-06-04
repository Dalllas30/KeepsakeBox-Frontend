/**
 * @author André Santana - fc49451
 */
import { PatientRegisterData } from './patient-register-data.model';

describe('PatientRegisterData', () => {
  it('should create an instance', () => {
    expect(new PatientRegisterData("","",null,null,"")).toBeTruthy();
  });
});
