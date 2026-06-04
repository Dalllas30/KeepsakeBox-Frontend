import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IndependentHomeComponent } from './independent-home.component';

describe('IndependentHomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndependentHomeComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(IndependentHomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
