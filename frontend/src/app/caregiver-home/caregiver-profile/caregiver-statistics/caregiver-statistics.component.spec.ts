import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverStatisticsComponent } from './caregiver-statistics.component';

describe('CaregiverStatisticsComponent', () => {
  let component: CaregiverStatisticsComponent;
  let fixture: ComponentFixture<CaregiverStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
