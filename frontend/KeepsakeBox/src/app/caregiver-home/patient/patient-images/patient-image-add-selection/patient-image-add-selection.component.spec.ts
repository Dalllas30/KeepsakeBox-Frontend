import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientImageAddSelectionComponent } from './patient-image-add-selection.component';

describe('PatientImageAddSelectionComponent', () => {
  let component: PatientImageAddSelectionComponent;
  let fixture: ComponentFixture<PatientImageAddSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientImageAddSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientImageAddSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
