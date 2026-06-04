import { TestBed } from '@angular/core/testing';

import { RtSessionService } from './rt-session.service';

describe('RtSessionService', () => {
  let service: RtSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RtSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
