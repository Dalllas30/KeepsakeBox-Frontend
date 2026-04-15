import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionDetailComponent } from './rt-session-detail.component';

describe('RtSessionDetailComponent', () => {
  let component: RtSessionDetailComponent;
  let fixture: ComponentFixture<RtSessionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
