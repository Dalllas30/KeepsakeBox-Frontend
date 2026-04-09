import { TestBed } from '@angular/core/testing';

import { RtSessionImageService } from './rt-session-image.service';

describe('RtSessionImageService', () => {
  let service: RtSessionImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RtSessionImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
