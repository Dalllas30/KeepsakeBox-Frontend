import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-language',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})
export class SelectLanguageComponent {
  public readonly languages: Array<'pt' | 'en'> = ['pt', 'en'];
  public currentLanguage: 'pt' | 'en';

  constructor(
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang('pt');
    this.currentLanguage = this.resolveSupportedLanguage(
      isPlatformBrowser(this.platformId)
        ? (localStorage.getItem('lang') || this.translate.currentLang || navigator.language)
        : 'pt'
    );
    this.translate.use(this.currentLanguage);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', this.currentLanguage);
    }
  }

  changeLanguage(language: string): void {
    this.currentLanguage = this.resolveSupportedLanguage(language);
    this.translate.use(this.currentLanguage);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', this.currentLanguage);
    }
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.changeLanguage(target.value);
    }
  }

  private resolveSupportedLanguage(rawLanguage: string): 'pt' | 'en' {
    return rawLanguage.toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }
}