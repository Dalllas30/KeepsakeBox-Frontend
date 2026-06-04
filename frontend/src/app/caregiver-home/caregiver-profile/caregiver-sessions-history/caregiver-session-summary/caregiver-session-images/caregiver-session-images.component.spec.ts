import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverSessionImagesComponent } from './caregiver-session-images.component';

describe('CaregiverSessionImagesComponent', () => {
  let component: CaregiverSessionImagesComponent;
  let fixture: ComponentFixture<CaregiverSessionImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverSessionImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverSessionImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
