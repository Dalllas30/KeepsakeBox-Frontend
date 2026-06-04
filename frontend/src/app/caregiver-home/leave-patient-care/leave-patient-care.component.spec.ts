import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePatientCareComponent } from './leave-patient-care.component';

describe('LeavePatientCareComponent', () => {
  let component: LeavePatientCareComponent;
  let fixture: ComponentFixture<LeavePatientCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavePatientCareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePatientCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
