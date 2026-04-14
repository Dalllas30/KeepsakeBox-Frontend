import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMessagesComponent } from './patient-messages.component';

describe('PatientMessagesComponent', () => {
  let component: PatientMessagesComponent;
  let fixture: ComponentFixture<PatientMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
