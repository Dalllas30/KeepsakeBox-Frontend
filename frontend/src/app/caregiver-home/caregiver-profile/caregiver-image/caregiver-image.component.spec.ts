import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverImageComponent } from './caregiver-image.component';

describe('CaregiverImageComponent', () => {
  let component: CaregiverImageComponent;
  let fixture: ComponentFixture<CaregiverImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
