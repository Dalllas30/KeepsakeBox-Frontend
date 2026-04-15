import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionAutomaticComponent } from './create-session-automatic.component';

describe('CreateSessionAutomaticComponent', () => {
  let component: CreateSessionAutomaticComponent;
  let fixture: ComponentFixture<CreateSessionAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSessionAutomaticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSessionAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
