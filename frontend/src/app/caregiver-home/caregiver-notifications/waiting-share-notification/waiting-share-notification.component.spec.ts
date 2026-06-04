import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingShareNotificationComponent } from './waiting-share-notification.component';

describe('WaitingShareNotificationComponent', () => {
  let component: WaitingShareNotificationComponent;
  let fixture: ComponentFixture<WaitingShareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingShareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingShareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
