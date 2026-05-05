import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Session } from '../../../../../core/models/session.model';
import { Patient } from '../../../../../core/models/patient.model';
import { Caregiver } from '../../../../../core/models/caregiver.model';
import { RtSessionImage } from '../../../../../core/models/rt-session-image.model';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { CaregiverService } from '../../../../../core/services/caregiver.service';
import { PatientService } from '../../../../../core/services/patient.service';
import { RtSessionService } from '../../../../../core/services/rt-session.service';
import { RtSessionImageService } from '../../../../../core/services/rt-session-image.service';

@Component({
  selector: 'app-caregiver-session-images',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule],
  templateUrl: './caregiver-session-images.component.html',
  styleUrls: ['./caregiver-session-images.component.css']
})
export class CaregiverSessionImagesComponent implements OnInit {
  @Input() page = 1;
  @Input() pageSize = 2;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public session!: Session;
  public patient!: Patient;
  public images!: RtSessionImage[];
  public caregiver!: Caregiver;
  public symptom: string = '';
  public symptomArray: string[] = [];

  constructor(
    private router: Router,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private rtSessionService: RtSessionService,
    private rtSessionImageService: RtSessionImageService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.session = this.rtSessionService.getCurrentSession()!;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    this.images = await this.rtSessionImageService.getSessionPatientImageInformation(
      this.authenticationService.getCurrentCaregiverToken()!, this.rtSessionService.getCurrentSession()!.id
    );
    this.collectionSize = this.images.length;
    this.cdr.detectChanges();
  }

  translate(): string[] {
    return this.translateCache == 'en'
      ? ['Joy or Happiness', 'Enthusiasm', 'Communication', 'Commitment', 'Anxiety', 'Agitation or Agressivity', 'Irritability or Lability', 'Apathy or Indifference', 'No Symptoms', ' and ']
      : ['Alegria', 'Entusiasmo', 'Comunicação', 'Empenho', 'Ansiedade', 'Agitação ou Agressividade', 'Irritabilidade ou Labilidade', 'Apatia ou Indiferencia', 'Nenhum Sintoma', ' e '];
  }

  getImageSymptom(ImageSymptom: any): string {
    this.symptomArray = [];
    if (ImageSymptom.joy === 1) this.symptomArray.push(this.translate()[0]);
    if (ImageSymptom.enthusiasm === 1) this.symptomArray.push(this.translate()[1]);
    if (ImageSymptom.communication === 1) this.symptomArray.push(this.translate()[2]);
    if (ImageSymptom.commitment === 1) this.symptomArray.push(this.translate()[3]);
    if (ImageSymptom.anxiety === 1) this.symptomArray.push(this.translate()[4]);
    if (ImageSymptom.agressivity === 1) this.symptomArray.push(this.translate()[5]);
    if (ImageSymptom.irritability === 1) this.symptomArray.push(this.translate()[6]);
    if (ImageSymptom.apathy === 1) this.symptomArray.push(this.translate()[7]);
    if (this.symptomArray.length > 1) return this.symptomArray.slice(0, -1).join(', ') + this.translate()[9] + this.symptomArray.slice(-1);
    if (this.symptomArray.length == 1) return this.symptomArray[0];
    return this.translate()[8];
  }

  async goToSessionSummary() { this.router.navigateByUrl('/caregiver/profile/history/summary'); }
}