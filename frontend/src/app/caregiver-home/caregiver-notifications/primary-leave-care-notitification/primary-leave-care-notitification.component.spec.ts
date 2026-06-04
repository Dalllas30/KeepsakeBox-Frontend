import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryLeaveCareNotitificationComponent } from './primary-leave-care-notitification.component';

describe('PrimaryLeaveCareNotitificationComponent', () => {
  let component: PrimaryLeaveCareNotitificationComponent;
  let fixture: ComponentFixture<PrimaryLeaveCareNotitificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryLeaveCareNotitificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryLeaveCareNotitificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
