import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPrimaryCareTransferNotificationComponent } from './waiting-primary-care-transfer-notification.component';

describe('WaitingPrimaryCareTransferNotificationComponent', () => {
  let component: WaitingPrimaryCareTransferNotificationComponent;
  let fixture: ComponentFixture<WaitingPrimaryCareTransferNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingPrimaryCareTransferNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingPrimaryCareTransferNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
