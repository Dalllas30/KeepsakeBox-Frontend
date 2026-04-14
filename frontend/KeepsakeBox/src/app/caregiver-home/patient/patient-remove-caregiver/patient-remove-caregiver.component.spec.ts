import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRemoveCaregiverComponent } from './patient-remove-caregiver.component';

describe('PatientRemoveCaregiverComponent', () => {
  let component: PatientRemoveCaregiverComponent;
  let fixture: ComponentFixture<PatientRemoveCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRemoveCaregiverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientRemoveCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
