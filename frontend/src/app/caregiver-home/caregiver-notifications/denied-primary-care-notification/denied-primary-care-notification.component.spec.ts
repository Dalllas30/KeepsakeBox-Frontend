import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedPrimaryCareNotificationComponent } from './denied-primary-care-notification.component';

describe('DeniedPrimaryCareNotificationComponent', () => {
  let component: DeniedPrimaryCareNotificationComponent;
  let fixture: ComponentFixture<DeniedPrimaryCareNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeniedPrimaryCareNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedPrimaryCareNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
