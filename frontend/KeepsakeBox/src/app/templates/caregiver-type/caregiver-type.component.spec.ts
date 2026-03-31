import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverTypeComponent } from './caregiver-type.component';

describe('CaregiverTypeComponent', () => {
  let component: CaregiverTypeComponent;
  let fixture: ComponentFixture<CaregiverTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaregiverTypeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
