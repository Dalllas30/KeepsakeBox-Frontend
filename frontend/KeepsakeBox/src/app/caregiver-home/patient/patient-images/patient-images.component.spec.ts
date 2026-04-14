import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientImagesComponent } from './patient-images.component';

describe('PatientImagesComponent', () => {
  let component: PatientImagesComponent;
  let fixture: ComponentFixture<PatientImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
