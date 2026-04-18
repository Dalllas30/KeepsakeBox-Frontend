import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedPrimaryLeaveCareNotificationComponent } from './denied-primary-leave-care-notification.component';

describe('DeniedPrimaryLeaveCareNotificationComponent', () => {
  let component: DeniedPrimaryLeaveCareNotificationComponent;
  let fixture: ComponentFixture<DeniedPrimaryLeaveCareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeniedPrimaryLeaveCareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedPrimaryLeaveCareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
