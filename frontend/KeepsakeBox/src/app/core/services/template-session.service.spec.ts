import { TestBed } from '@angular/core/testing';

import { TemplateSessionService } from './template-session.service';

describe('TemplateSessionService', () => {
  let service: TemplateSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
