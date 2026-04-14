import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSessionsComponent } from './patient-sessions.component';

describe('PatientSessionsComponent', () => {
  let component: PatientSessionsComponent;
  let fixture: ComponentFixture<PatientSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
