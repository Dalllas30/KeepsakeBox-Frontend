import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverHelpComponent } from './caregiver-help.component';

describe('CaregiverHelpComponent', () => {
  let component: CaregiverHelpComponent;
  let fixture: ComponentFixture<CaregiverHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverHelpComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
