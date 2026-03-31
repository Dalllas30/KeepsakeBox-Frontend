/**
 * @author André Santana - fc49451
 */

import { LoginData } from './login-data.model';

describe('LoginData', () => {
  it('should create an instance', () => {
    expect(new LoginData("","")).toBeTruthy();
  });
});
