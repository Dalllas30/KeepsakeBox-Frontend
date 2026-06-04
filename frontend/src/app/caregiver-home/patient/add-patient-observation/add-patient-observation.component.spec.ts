import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientObservationComponent } from './add-patient-observation.component';

describe('AddPatientObservationComponent', () => {
  let component: AddPatientObservationComponent;
  let fixture: ComponentFixture<AddPatientObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPatientObservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientObservationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
