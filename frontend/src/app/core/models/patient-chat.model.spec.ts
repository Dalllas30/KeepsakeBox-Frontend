/**
 * @author André Santana - fc49451
 */

import { PatientChat } from './patient-chat.model';

describe('PatientChat', () => {
  it('should create an instance', () => {
    expect(new PatientChat("",null)).toBeTruthy();
  });
});
