import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePatientObservationComponent } from './update-patient-observation.component';

describe('UpdatePatientObservationComponent', () => {
  let component: UpdatePatientObservationComponent;
  let fixture: ComponentFixture<UpdatePatientObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePatientObservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePatientObservationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
