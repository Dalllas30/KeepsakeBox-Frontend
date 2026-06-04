import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedPrimaryCareNotificationComponent } from './accepted-primary-care-notification.component';

describe('AcceptedPrimaryCareNotificationComponent', () => {
  let component: AcceptedPrimaryCareNotificationComponent;
  let fixture: ComponentFixture<AcceptedPrimaryCareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedPrimaryCareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptedPrimaryCareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
