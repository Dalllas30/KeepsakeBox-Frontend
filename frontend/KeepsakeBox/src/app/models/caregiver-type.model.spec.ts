/**
 * @author André Santana - fc49451
 */

import { CaregiverType } from './caregiver-type.model';

describe('CaregiverType', () => {
  it('should create an instance', () => {
    expect(new CaregiverType("","")).toBeTruthy();
  });
});
