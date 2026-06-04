import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-language',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})
export class SelectLanguageComponent {
  public readonly languages: Array<'pt' | 'en'> = ['pt', 'en'];
  public currentLanguage: 'pt' | 'en' = 'pt';

  constructor(
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('lang');
      if (saved) {
        this.currentLanguage = (saved.startsWith('pt') ? 'pt' : 'en');
        this.translate.use(this.currentLanguage);
      }
    }
  }

  ngOnInit() {  
    const active = this.translate.getCurrentLang() || localStorage.getItem('lang') || 'pt';
    this.currentLanguage = active.startsWith('pt') ? 'pt' : 'en';

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = this.resolveSupportedLanguage(event.lang);
    });
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