import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovedFromPatientNotificationComponent } from './removed-from-patient-notification.component';

describe('RemovedFromPatientNotificationComponent', () => {
  let component: RemovedFromPatientNotificationComponent;
  let fixture: ComponentFixture<RemovedFromPatientNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemovedFromPatientNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemovedFromPatientNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
