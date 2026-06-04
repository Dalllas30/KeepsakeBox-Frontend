import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedSharePatientNotificationComponent } from './accepted-share-patient-notification.component';

describe('AcceptedSharePatientNotificationComponent', () => {
  let component: AcceptedSharePatientNotificationComponent;
  let fixture: ComponentFixture<AcceptedSharePatientNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedSharePatientNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptedSharePatientNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
