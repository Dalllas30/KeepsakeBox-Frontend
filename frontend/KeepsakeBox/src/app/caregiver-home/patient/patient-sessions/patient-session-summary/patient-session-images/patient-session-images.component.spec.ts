import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSessionImagesComponent } from './patient-session-images.component';

describe('PatientSessionImagesComponent', () => {
  let component: PatientSessionImagesComponent;
  let fixture: ComponentFixture<PatientSessionImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSessionImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSessionImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
