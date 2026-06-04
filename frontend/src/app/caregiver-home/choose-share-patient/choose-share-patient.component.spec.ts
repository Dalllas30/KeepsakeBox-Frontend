import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSharePatientComponent } from './choose-share-patient.component';

describe('ChooseSharePatientComponent', () => {
  let component: ChooseSharePatientComponent;
  let fixture: ComponentFixture<ChooseSharePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseSharePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseSharePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
