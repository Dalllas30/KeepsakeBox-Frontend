import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverSessionSummaryComponent } from './caregiver-session-summary.component';

describe('CaregiverSessionSummaryComponent', () => {
  let component: CaregiverSessionSummaryComponent;
  let fixture: ComponentFixture<CaregiverSessionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverSessionSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverSessionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
