import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedSharePatientNotificationComponent } from './denied-share-patient-notification.component';

describe('DeniedSharePatientNotificationComponent', () => {
  let component: DeniedSharePatientNotificationComponent;
  let fixture: ComponentFixture<DeniedSharePatientNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeniedSharePatientNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedSharePatientNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
