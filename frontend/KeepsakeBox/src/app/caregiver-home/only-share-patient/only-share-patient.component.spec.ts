import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlySharePatientComponent } from './only-share-patient.component';

describe('OnlySharePatientComponent', () => {
  let component: OnlySharePatientComponent;
  let fixture: ComponentFixture<OnlySharePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlySharePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlySharePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
