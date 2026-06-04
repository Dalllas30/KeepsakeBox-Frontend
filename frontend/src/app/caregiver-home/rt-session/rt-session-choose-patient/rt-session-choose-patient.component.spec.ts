import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionChoosePatientComponent } from './rt-session-choose-patient.component';

describe('RtSessionChoosePatientComponent', () => {
  let component: RtSessionChoosePatientComponent;
  let fixture: ComponentFixture<RtSessionChoosePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionChoosePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionChoosePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
