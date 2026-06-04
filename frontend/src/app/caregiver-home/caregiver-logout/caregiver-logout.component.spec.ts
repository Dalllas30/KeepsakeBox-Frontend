import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverLogoutComponent } from './caregiver-logout.component';

describe('CaregiverLogoutComponent', () => {
  let component: CaregiverLogoutComponent;
  let fixture: ComponentFixture<CaregiverLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverLogoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverLogoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
