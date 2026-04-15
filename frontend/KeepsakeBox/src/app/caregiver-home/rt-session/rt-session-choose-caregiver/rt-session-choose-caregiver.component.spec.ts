import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionChooseCaregiverComponent } from './rt-session-choose-caregiver.component';

describe('RtSessionChooseCaregiverComponent', () => {
  let component: RtSessionChooseCaregiverComponent;
  let fixture: ComponentFixture<RtSessionChooseCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionChooseCaregiverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionChooseCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
