import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalSharePatientComponent } from './principal-share-patient.component';

describe('PrincipalSharePatientComponent', () => {
  let component: PrincipalSharePatientComponent;
  let fixture: ComponentFixture<PrincipalSharePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalSharePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalSharePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
