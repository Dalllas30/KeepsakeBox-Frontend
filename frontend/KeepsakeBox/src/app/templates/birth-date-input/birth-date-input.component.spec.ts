import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthDateInputComponent } from './birth-date-input.component';

describe('BirthDateInputComponent', () => {
  let component: BirthDateInputComponent;
  let fixture: ComponentFixture<BirthDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthDateInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BirthDateInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
