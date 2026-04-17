import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Session } from '../../../../core/models/session.model';
import { RtSessionImage } from '../../../../core/models/rt-session-image.model';
import { Patient } from '../../../../core/models/patient.model';
import { Caregiver } from '../../../../core/models/caregiver.model';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { CaregiverService } from '../../../../core/services/caregiver.service';
import { CategoryService } from '../../../../core/services/category.service';
import { PatientService } from '../../../../core/services/patient.service';
import { RtSessionService } from '../../../../core/services/rt-session.service';
import { RtSessionImageService } from '../../../../core/services/rt-session-image.service';

@Component({
  selector: 'app-patient-session-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './patient-session-summary.component.html',
  styleUrls: ['./patient-session-summary.component.css']
})
export class PatientSessionSummaryComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public session!: Session;
  public images!: RtSessionImage[];
  public categories: string[] = [];
  public patient!: Patient;
  public caregiver!: Caregiver;
  public caregiverType!: string;
  public themes = "";
  public symptom: string = "";
  public symptomArray: string[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private rtSessionService: RtSessionService,
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private rtSessionImageService: RtSessionImageService,
    private categoryService: CategoryService
  ) {}

  async ngOnInit(): Promise<void> {
    this.categories = [];
    this.session = this.rtSessionService.getCurrentSession()!;
    this.getCurrentCaregiver(this.session.caregiver_id);
    this.patient = this.patientService.getCurrentPatient()!;
    this.images = await this.rtSessionImageService.getSessionPatientImageInformation(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.rtSessionService.getCurrentSession()!.id
    );
    if (this.translateCache == 'en') {
      for (let image = 0; image < this.images.length; image++) {
        this.images[image].category = this.categoryService.categoryTranslation(this.images[image].category, 'en');
      }
    }
    await this.getCategories();
  }

  async getCurrentCaregiver(caregiver_id: string): Promise<string> {
    this.caregiver = (await this.caregiverService.getCaregiverById(
      this.authenticationService.getCurrentCaregiverToken()!, caregiver_id))!;
    this.caregiverType = this.caregiver.type;
    return this.caregiverType;
  }

  async getCategories(): Promise<string> {
    for (let image = 0; image < this.images.length; image++) {
      if (!this.categories.includes(this.images[image].category)) {
        this.categories.push(this.images[image].category);
      }
    }
    const count: any = {};
    for (let index = 0; index < this.images.length; index++) {
      const element = this.images[index].category;
      count[element] = count[element] ? count[element] + 1 : 1;
    }
    this.categories.sort((a, b) => (a > b ? 1 : -1));
    this.categories.sort((a, b) => (count[a] > count[b] ? -1 : 1));
    for (let cat = 0; cat < this.categories.length; cat++) {
      if (this.categories.length > 1) {
        if (cat === this.categories.length - 1) this.themes += this.translate()[9] + this.categories[cat];
        else if (cat === this.categories.length - 2) this.themes += this.categories[cat] + " ";
        else this.themes += this.categories[cat] + ", ";
      } else {
        this.themes += this.categories[cat];
      }
    }
    return this.themes;
  }

  translate(): string[] {
    return this.translateCache == 'en'
      ? ['Joy or Happiness', 'Enthusiasm', 'Communication', 'Commitment', 'Anxiety', 'Agitation or Agressivity', 'Irritability or Lability', 'Apathy or Indifference', 'No Symptoms', ' and ']
      : ['Alegria', 'Entusiasmo', 'Comunicação', 'Empenho', 'Ansiedade', 'Agitação ou Agressividade', 'Irritabilidade ou Labilidade', 'Apatia ou Indiferencia', 'Nenhum Sintoma', ' e '];
  }

  getFinalSymptom(): string {
    const sFeedback = this.session.global_feedback!;
    this.symptom = '';
    this.symptomArray = [];
    if (sFeedback.joy === 1) this.symptomArray.push(this.translate()[0]);
    if (sFeedback.enthusiasm === 1) this.symptomArray.push(this.translate()[1]);
    if (sFeedback.communication === 1) this.symptomArray.push(this.translate()[2]);
    if (sFeedback.commitment === 1) this.symptomArray.push(this.translate()[3]);
    if (sFeedback.anxiety === 1) this.symptomArray.push(this.translate()[4]);
    if (sFeedback.agressivity === 1) this.symptomArray.push(this.translate()[5]);
    if (sFeedback.irritability === 1) this.symptomArray.push(this.translate()[6]);
    if (sFeedback.apathy === 1) this.symptomArray.push(this.translate()[7]);
    if (this.symptomArray.length > 1) this.symptom = this.symptomArray.slice(0, -1).join(', ') + this.translate()[9] + this.symptomArray.slice(-1);
    else if (this.symptomArray.length == 1) this.symptom = this.symptomArray[0];
    else this.symptom = this.translate()[8];
    return this.symptom;
  }

  async goToCaregiverSessionList() {
    this.router.navigateByUrl('/caregiver/person/sessions');
  }

  async goToSessionImages() {
    this.router.navigate(['/caregiver/person/sessions/summary/images']);
  }
}