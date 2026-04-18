import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryCareTransferNotificationComponent } from './primary-care-transfer-notification.component';

describe('PrimaryCareTransferNotificationComponent', () => {
  let component: PrimaryCareTransferNotificationComponent;
  let fixture: ComponentFixture<PrimaryCareTransferNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryCareTransferNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryCareTransferNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
