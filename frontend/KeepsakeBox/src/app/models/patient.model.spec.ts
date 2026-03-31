/**
 * @author André Santana - fc49451
 */

import { PatientChat } from './patient-chat.model';
import { Patient } from './patient.model';

describe('Patient', () => {
  it('should create an instance', () => {
    expect(new Patient("","","",null,null,"",true,null,new PatientChat("",null))).toBeTruthy();
  });
});
