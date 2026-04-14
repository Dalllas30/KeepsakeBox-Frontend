import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePatientPrimaryCareComponent } from './leave-patient-primary-care.component';

describe('LeavePatientPrimaryCareComponent', () => {
  let component: LeavePatientPrimaryCareComponent;
  let fixture: ComponentFixture<LeavePatientPrimaryCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavePatientPrimaryCareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePatientPrimaryCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
