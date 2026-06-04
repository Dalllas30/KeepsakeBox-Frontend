/**
 * @author André Santana - fc49451
 */

import { BirthDate } from './birth-date.model';
import { RegisterStep1Data } from './register-step1-data.model';

describe('RegisterStep1Data', () => {
  it('should create an instance', () => {
    expect(new RegisterStep1Data("",new BirthDate(0,0,0),"","","",)).toBeTruthy();
  });
});
