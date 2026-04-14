import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionComponent } from './rt-session.component';

describe('RtSessionComponent', () => {
  let component: RtSessionComponent;
  let fixture: ComponentFixture<RtSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
