import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideUserImageUploadComponent } from './outside-user-image-upload.component';

describe('OutsideUserImageUploadComponent', () => {
  let component: OutsideUserImageUploadComponent;
  let fixture: ComponentFixture<OutsideUserImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutsideUserImageUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutsideUserImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
