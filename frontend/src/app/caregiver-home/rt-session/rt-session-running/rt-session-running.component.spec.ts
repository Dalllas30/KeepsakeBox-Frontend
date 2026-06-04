import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionRunningComponent } from './rt-session-running.component';

describe('RtSessionRunningComponent', () => {
  let component: RtSessionRunningComponent;
  let fixture: ComponentFixture<RtSessionRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionRunningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
