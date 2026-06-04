import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPrimaryLeaveCareNotificationComponent } from './waiting-primary-leave-care-notification.component';

describe('WaitingPrimaryLeaveCareNotificationComponent', () => {
  let component: WaitingPrimaryLeaveCareNotificationComponent;
  let fixture: ComponentFixture<WaitingPrimaryLeaveCareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingPrimaryLeaveCareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingPrimaryLeaveCareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
