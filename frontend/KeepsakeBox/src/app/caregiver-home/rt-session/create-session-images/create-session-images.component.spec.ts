import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionImagesComponent } from './create-session-images.component';

describe('CreateSessionImagesComponent', () => {
  let component: CreateSessionImagesComponent;
  let fixture: ComponentFixture<CreateSessionImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSessionImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSessionImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
