import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePatientObservationComponent } from './delete-patient-observation.component';

describe('DeletePatientObservationComponent', () => {
  let component: DeletePatientObservationComponent;
  let fixture: ComponentFixture<DeletePatientObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePatientObservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePatientObservationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
