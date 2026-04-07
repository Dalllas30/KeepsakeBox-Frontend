import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverNotificationsComponent } from './caregiver-notifications.component';

describe('CaregiverNotificationsComponent', () => {
  let component: CaregiverNotificationsComponent;
  let fixture: ComponentFixture<CaregiverNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverNotificationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
