import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverValidationComponent } from './caregiver-validation.component';

describe('CaregiverValidationComponent', () => {
  let component: CaregiverValidationComponent;
  let fixture: ComponentFixture<CaregiverValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
