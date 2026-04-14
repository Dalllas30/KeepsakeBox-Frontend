import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCaregiverComponent } from './patient-caregiver.component';

describe('PatientCaregiverComponent', () => {
  let component: PatientCaregiverComponent;
  let fixture: ComponentFixture<PatientCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCaregiverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
