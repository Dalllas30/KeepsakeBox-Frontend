import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverHomeComponent } from './caregiver-home.component';

describe('CaregiverHomeComponent', () => {
  let component: CaregiverHomeComponent;
  let fixture: ComponentFixture<CaregiverHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaregiverHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
