import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSearchComponent } from './online-search.component';

describe('OnlineSearchComponent', () => {
  let component: OnlineSearchComponent;
  let fixture: ComponentFixture<OnlineSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
