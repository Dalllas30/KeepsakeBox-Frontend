import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedPrimaryLeaveCareNotificationComponent } from './accepted-primary-leave-care-notification.component';

describe('AcceptedPrimaryLeaveCareNotificationComponent', () => {
  let component: AcceptedPrimaryLeaveCareNotificationComponent;
  let fixture: ComponentFixture<AcceptedPrimaryLeaveCareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedPrimaryLeaveCareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptedPrimaryLeaveCareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
