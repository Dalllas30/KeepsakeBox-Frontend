import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionCategoriesComponent } from './create-session-categories.component';

describe('CreateSessionCategoriesComponent', () => {
  let component: CreateSessionCategoriesComponent;
  let fixture: ComponentFixture<CreateSessionCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSessionCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSessionCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
