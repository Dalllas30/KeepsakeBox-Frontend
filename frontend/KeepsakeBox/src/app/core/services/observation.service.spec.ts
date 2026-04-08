import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationService } from './observation/observation.service';

describe('ObservationService', () => {
  let component: ObservationService;
  let fixture: ComponentFixture<ObservationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
