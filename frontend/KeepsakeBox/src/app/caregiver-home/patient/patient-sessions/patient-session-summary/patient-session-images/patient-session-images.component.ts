import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RtSessionImage } from '../../../../../core/models/rt-session-image.model';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { RtSessionService } from '../../../../../core/services/rt-session.service';
import { RtSessionImageService } from '../../../../../core/services/rt-session-image.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-patient-session-images',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPagination],
  templateUrl: './patient-session-images.component.html',
  styleUrls: ['./patient-session-images.component.css']
})
export class PatientSessionImagesComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  @Input() page = 1;
  @Input() pageSize = 2;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public images!: RtSessionImage[];
  public symptom: string = "";
  public symptomArray: string[] = [];

  constructor(
    private router: Router,
    private rtSessionService: RtSessionService,
    private rtSessionImageService: RtSessionImageService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.images = await this.rtSessionImageService.getSessionPatientImageInformation(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.rtSessionService.getCurrentSession()!.id
    );
    this.collectionSize = this.images.length;
  }

  translate(): string[] {
    return this.translateCache == 'en'
      ? ['Joy or Happiness', 'Enthusiasm', 'Communication', 'Commitment', 'Anxiety', 'Agitation or Agressivity', 'Irritability or Lability', 'Apathy or Indifference', 'No Symptoms', ' and ']
      : ['Alegria', 'Entusiasmo', 'Comunicação', 'Empenho', 'Ansiedade', 'Agitação ou Agressividade', 'Irritabilidade ou Labilidade', 'Apatia ou Indiferencia', 'Nenhum Sintoma', ' e '];
  }

  getImageSymptom(ImageSymptom: any): string {
    this.symptom = '';
    this.symptomArray = [];
    if (ImageSymptom.joy === 1) this.symptomArray.push(this.translate()[0]);
    if (ImageSymptom.enthusiasm === 1) this.symptomArray.push(this.translate()[1]);
    if (ImageSymptom.communication === 1) this.symptomArray.push(this.translate()[2]);
    if (ImageSymptom.commitment === 1) this.symptomArray.push(this.translate()[3]);
    if (ImageSymptom.anxiety === 1) this.symptomArray.push(this.translate()[4]);
    if (ImageSymptom.agressivity === 1) this.symptomArray.push(this.translate()[5]);
    if (ImageSymptom.irritability === 1) this.symptomArray.push(this.translate()[6]);
    if (ImageSymptom.apathy === 1) this.symptomArray.push(this.translate()[7]);
    if (this.symptomArray.length > 1) this.symptom = this.symptomArray.slice(0, -1).join(', ') + this.translate()[9] + this.symptomArray.slice(-1);
    else if (this.symptomArray.length == 1) this.symptom = this.symptomArray[0];
    else this.symptom = this.translate()[8];
    return this.symptom;
  }

  async goToSessionSummary() {
    this.router.navigateByUrl('/caregiver/person/sessions/summary');
  }
}