import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverImageAddSelectionComponent } from './caregiver-image-add-selection.component';

describe('CaregiverImageAddSelectionComponent', () => {
  let component: CaregiverImageAddSelectionComponent;
  let fixture: ComponentFixture<CaregiverImageAddSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverImageAddSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverImageAddSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
