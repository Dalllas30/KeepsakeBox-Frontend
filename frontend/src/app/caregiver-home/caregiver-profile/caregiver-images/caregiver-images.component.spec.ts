import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverImagesComponent } from './caregiver-images.component';

describe('CaregiverImagesComponent', () => {
  let component: CaregiverImagesComponent;
  let fixture: ComponentFixture<CaregiverImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
