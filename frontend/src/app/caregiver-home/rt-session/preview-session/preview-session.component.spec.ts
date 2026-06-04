import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSessionComponent } from './preview-session.component';

describe('PreviewSessionComponent', () => {
  let component: PreviewSessionComponent;
  let fixture: ComponentFixture<PreviewSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
