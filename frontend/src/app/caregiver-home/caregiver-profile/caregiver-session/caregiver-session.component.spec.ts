import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverSessionComponent } from './caregiver-session.component';

describe('CaregiverSessionComponent', () => {
  let component: CaregiverSessionComponent;
  let fixture: ComponentFixture<CaregiverSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
