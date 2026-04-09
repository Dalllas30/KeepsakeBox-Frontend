import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverValidationImagesComponent } from './caregiver-validation-images.component';

describe('CaregiverValidationImagesComponent', () => {
  let component: CaregiverValidationImagesComponent;
  let fixture: ComponentFixture<CaregiverValidationImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverValidationImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverValidationImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
