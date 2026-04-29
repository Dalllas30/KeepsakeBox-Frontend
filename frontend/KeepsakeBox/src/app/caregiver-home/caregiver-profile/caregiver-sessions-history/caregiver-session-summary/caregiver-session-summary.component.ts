import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Session } from '../../../../core/models/session.model';
import { Patient } from '../../../../core/models/patient.model';
import { Caregiver } from '../../../../core/models/caregiver.model';
import { RtSessionImage } from '../../../../core/models/rt-session-image.model';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { CaregiverService } from '../../../../core/services/caregiver.service';
import { PatientService } from '../../../../core/services/patient.service';
import { RtSessionService } from '../../../../core/services/rt-session.service';
import { RtSessionImageService } from '../../../../core/services/rt-session-image.service';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-caregiver-session-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './caregiver-session-summary.component.html',
  styleUrls: ['./caregiver-session-summary.component.css']
})
export class CaregiverSessionSummaryComponent implements OnInit {
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public session!: Session;
  public patient!: Patient;
  public images!: RtSessionImage[];
  public caregiver!: Caregiver;
  public categories: string[] = [];
  public patientsList: Patient[] = [];
  public themes = "";
  public symptom: string = '';
  public symptomArray: string[] = [];

  constructor(
    private router: Router,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private rtSessionService: RtSessionService,
    private rtSessionImageService: RtSessionImageService,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.session = this.rtSessionService.getCurrentSession()!;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patientsList = await this.caregiverService.getCaregiverPatients(this.authenticationService.getCurrentCaregiverToken()!) ?? [];
    await this.getPatient();
    this.images = await this.rtSessionImageService.getSessionPatientImageInformation(
      this.authenticationService.getCurrentCaregiverToken()!, this.rtSessionService.getCurrentSession()!.id
    );
    if (this.translateCache == 'en') {
      for (let image of this.images) image.category = this.categoryService.categoryTranslation(image.category, 'en');
    }
    await this.getCategories();
    this.cdr.detectChanges();
  }

  async getPatient() {
    for (let p of this.patientsList) {
      if (p.id == this.session.patient_id) this.patient = p;
    }
  }

  async getCategories(): Promise<string> {
    for (let image of this.images) {
      if (!this.categories.includes(image.category)) this.categories.push(image.category);
    }
    const count: any = {};
    for (let image of this.images) {
      count[image.category] = (count[image.category] || 0) + 1;
    }
    this.categories.sort((a, b) => a > b ? 1 : -1).sort((a, b) => count[a] > count[b] ? -1 : 1);
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories.length > 1) {
        if (i === this.categories.length - 1) this.themes += this.translate()[9] + this.categories[i];
        else if (i === this.categories.length - 2) this.themes += this.categories[i] + " ";
        else this.themes += this.categories[i] + ", ";
      } else {
        this.themes += this.categories[i];
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
    let sFeedback = this.session.global_feedback;
    this.symptomArray = [];
    if (sFeedback.joy === 1) this.symptomArray.push(this.translate()[0]);
    if (sFeedback.enthusiasm === 1) this.symptomArray.push(this.translate()[1]);
    if (sFeedback.communication === 1) this.symptomArray.push(this.translate()[2]);
    if (sFeedback.commitment === 1) this.symptomArray.push(this.translate()[3]);
    if (sFeedback.anxiety === 1) this.symptomArray.push(this.translate()[4]);
    if (sFeedback.agressivity === 1) this.symptomArray.push(this.translate()[5]);
    if (sFeedback.irritability === 1) this.symptomArray.push(this.translate()[6]);
    if (sFeedback.apathy === 1) this.symptomArray.push(this.translate()[7]);
    if (this.symptomArray.length > 1) return this.symptomArray.slice(0, -1).join(', ') + this.translate()[9] + this.symptomArray.slice(-1);
    if (this.symptomArray.length == 1) return this.symptomArray[0];
    return this.translate()[8];
  }

  async goToPatientSessionList() { this.router.navigateByUrl('/caregiver/profile/history'); }
  async goToSessionImages() { this.router.navigate(['/caregiver/profile/history/summary/images']); }
}