import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { SelectLanguageComponent } from '../features/select-language/select-language.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, SelectLanguageComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';

  public currentImages: any[] = [];

  public imagesPT = [
    {src: "/assets/screen1.png", alt:"Perfil Cuidador"},
    {src: "/assets/screen2.png", alt:"Lista Beneficiários/Familiares"},
    {src: "/assets/screen3.png", alt:"Adicionar Beneficiário/Familiar"},
    {src: "/assets/screen4.png", alt:"Perfil Beneficiário/Familiar"},
    {src: "/assets/screen5.png", alt:"Imagens Beneficiário/Familiar"},
    {src: "/assets/screen6.png", alt:"Imagem"}
  ];

  public imagesENG = [
    {src: "/assets/screen1eng.png", alt:"Caregiver Profile"},
    {src: "/assets/screen2eng.png", alt:"Beneficiaries/Relatives List"},
    {src: "/assets/screen3eng.png", alt:"Add Beneficiary/Relative"},
    {src: "/assets/screen4eng.png", alt:"Beneficiary/Relative's Profile"},
    {src: "/assets/screen5eng.png", alt:"Beneficiary/Relative's Images"},
    {src: "/assets/screen6eng.png", alt:"Image"}
  ];

  constructor(
    private translate: TranslateService, 
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    const activeLang = this.translate.getCurrentLang() || 
                     localStorage.getItem('lang') || 
                     'pt';
    
    this.updateImages(activeLang);

    this.translate.onLangChange.subscribe((event) => {
      this.updateImages(event.lang);
    });
  }

  private updateImages(lang: string) {
    const newImages = lang.toLowerCase().startsWith('pt') ? this.imagesPT : this.imagesENG;
    this.currentImages = [...newImages];
    //this.currentImages = lang.toLowerCase().startsWith('pt') ? this.imagesPT : this.imagesENG;
  }
}