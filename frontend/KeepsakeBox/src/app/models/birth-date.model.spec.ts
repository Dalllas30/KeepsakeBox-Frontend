/**
 * @author André Santana - fc49451
 */

import { BirthDate } from './birth-date.model';

describe('BirthDate', () => {
  it('should create an instance', () => {
    expect(new BirthDate(0,0,0,true)).toBeTruthy();
  });
});
