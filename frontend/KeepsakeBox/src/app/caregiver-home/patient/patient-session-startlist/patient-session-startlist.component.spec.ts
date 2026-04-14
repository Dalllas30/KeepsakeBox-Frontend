import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSessionStartlistComponent } from './patient-session-startlist.component';

describe('PatientSessionStartlistComponent', () => {
  let component: PatientSessionStartlistComponent;
  let fixture: ComponentFixture<PatientSessionStartlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSessionStartlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSessionStartlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
