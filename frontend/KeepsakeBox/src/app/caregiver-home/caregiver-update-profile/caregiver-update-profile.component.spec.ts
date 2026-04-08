import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverUpdateProfileComponent } from './caregiver-update-profile.component';

describe('CaregiverUpdateProfileComponent', () => {
  let component: CaregiverUpdateProfileComponent;
  let fixture: ComponentFixture<CaregiverUpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverUpdateProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverUpdateProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
