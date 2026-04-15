import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionFeedbackComponent } from './rt-session-feedback.component';

describe('RtSessionFeedbackComponent', () => {
  let component: RtSessionFeedbackComponent;
  let fixture: ComponentFixture<RtSessionFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
