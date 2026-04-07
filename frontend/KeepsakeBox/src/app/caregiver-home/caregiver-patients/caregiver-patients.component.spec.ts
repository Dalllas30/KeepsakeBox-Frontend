import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverPatientsComponent } from './caregiver-patients.component';

describe('CaregiverPatientsComponent', () => {
  let component: CaregiverPatientsComponent;
  let fixture: ComponentFixture<CaregiverPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverPatientsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
