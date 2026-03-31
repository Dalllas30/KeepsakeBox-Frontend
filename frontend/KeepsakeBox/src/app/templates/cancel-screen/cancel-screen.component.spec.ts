import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelScreenComponent } from './cancel-screen.component';

describe('CancelScreenComponent', () => {
  let component: CancelScreenComponent;
  let fixture: ComponentFixture<CancelScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelScreenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
