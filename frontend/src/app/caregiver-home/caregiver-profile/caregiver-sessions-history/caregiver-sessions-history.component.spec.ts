import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverSessionsHistoryComponent } from './caregiver-sessions-history.component';

describe('CaregiverSessionsHistoryComponent', () => {
  let component: CaregiverSessionsHistoryComponent;
  let fixture: ComponentFixture<CaregiverSessionsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverSessionsHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverSessionsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
