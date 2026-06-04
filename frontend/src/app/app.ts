import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('KeepsakeBox');

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    const lang = isPlatformBrowser(this.platformId) 
      ? (localStorage.getItem('lang') || 'pt') 
      : 'pt';
    this.translate.addLangs(['pt', 'en']);
    this.translate.setFallbackLang('pt');
    this.translate.use(lang);
  }
}