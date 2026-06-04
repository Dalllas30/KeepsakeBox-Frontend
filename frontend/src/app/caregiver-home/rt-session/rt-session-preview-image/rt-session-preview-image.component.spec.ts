import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSessionPreviewImageComponent } from './rt-session-preview-image.component';

describe('RtSessionPreviewImageComponent', () => {
  let component: RtSessionPreviewImageComponent;
  let fixture: ComponentFixture<RtSessionPreviewImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtSessionPreviewImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtSessionPreviewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
