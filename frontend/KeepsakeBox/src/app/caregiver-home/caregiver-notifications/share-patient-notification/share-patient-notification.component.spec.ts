import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePatientNotificationComponent } from './share-patient-notification.component';

describe('SharePatientNotificationComponent', () => {
  let component: SharePatientNotificationComponent;
  let fixture: ComponentFixture<SharePatientNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePatientNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharePatientNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
