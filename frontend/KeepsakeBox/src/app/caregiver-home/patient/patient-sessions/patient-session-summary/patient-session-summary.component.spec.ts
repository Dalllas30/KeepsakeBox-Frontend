import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSessionSummaryComponent } from './patient-session-summary.component';

describe('PatientSessionSummaryComponent', () => {
  let component: PatientSessionSummaryComponent;
  let fixture: ComponentFixture<PatientSessionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSessionSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSessionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
