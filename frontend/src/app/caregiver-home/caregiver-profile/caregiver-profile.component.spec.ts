import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverProfileComponent } from './caregiver-profile.component';

describe('CaregiverProfileComponent', () => {
  let component: CaregiverProfileComponent;
  let fixture: ComponentFixture<CaregiverProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
