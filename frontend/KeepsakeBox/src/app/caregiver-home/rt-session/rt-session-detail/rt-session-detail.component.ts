import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AppContext } from '../../../core/models/app-context.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { PersonalImage } from '../../../core/models/personal-image.model';
import { RtSessionCreateData } from '../../../core/models/rt-session-create-data.model';
import { TemplateSession } from '../../../core/models/template-session.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { DialogService } from '../../../core/services/dialog.service';
import { PatientService } from '../../../core/services/patient.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';

@Component({
  selector: 'app-rt-session-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './rt-session-detail.component.html',
  styleUrls: ['./rt-session-detail.component.css']
})
export class RtSessionDetailComponent implements OnInit {

  public loadingImages!: boolean;
  public appContext!: AppContext;
  public templateSession!: TemplateSession;
  public caregiver!: Caregiver;
  public patient!: Patient;
  public patients: String = "";
  public original_patient_name: String = "";
  public selectedImages!: PersonalImage[];
  public selectedImages4Edition: RtSessionCreateData[] = [];

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private appService: AppService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private templateSessionService: TemplateSessionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingImages = true;
    this.appContext = this.appService.getAppContext()!;
    this.templateSession = this.templateSessionService.getTemplateSession()!;
    this.caregiver = (await this.caregiverService.getCurrentCaregiver())!;
    if (this.caregiver.id != this.templateSession.caregiver_id) {
      this.caregiver = (await this.caregiverService.getCaregiverById(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.templateSession.caregiver_id))!;
    }
    this.selectedImages = await this.templateSessionService.getImagesByTemplateSessionId(
      this.authenticationService.getCurrentCaregiverToken()!, this.appContext.templateSessionId);
    this.loadingImages = false;

    if (this.templateSession.created_patient_id == this.templateSession.patient_id) {
      this.original_patient_name = this.templateSession.patient_name;
    } else if (this.isForPatient(this.templateSession)) {
      let response = await this.patientService.getPatientNameById(
        this.authenticationService.getCurrentCaregiverToken()!, this.templateSession.created_patient_id);
      this.original_patient_name = response.result;
    } else {
      this.original_patient_name = "";
    }
  }

  isForPatient(templateSession: TemplateSession): boolean {
    return !!templateSession.created_patient_id;
  }

  async backToImageSelection(): Promise<void> {
    this.router.navigate([this.appContext.routingBack]);
  }

  imagesSize(lst: PersonalImage[]): number {
    if (this.loadingImages) return -1;
    else if (lst == null) return 0;
    else return lst.length;
  }

  goToEditTemplateSession(): void {
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.selectedImages4Edition.push(new RtSessionCreateData(
        this.selectedImages[i].image.id,
        this.selectedImages[i].image,
        false,
        this.selectedImages[i].isFavorite));
    }
    this.templateSessionService.resetCurrentRtSessionData();
    this.templateSessionService.setCurrentRtSessionData(this.selectedImages4Edition);
    this.appService.resetAppContext();
    this.appContext.editing = true;
    this.appService.setAppContext(this.appContext);
    this.router.navigate(['/caregiver/session/preview']);
  }

  goToShareSession(): void {
    this.router.navigate(['/caregiver/session/share/caregiver']);
  }

  goToAlocatePatient(): void {
    this.caregiverService.resetSelectedCaregiver();
    this.caregiverService.setSelectedCaregiver(this.caregiver);
    this.router.navigate(['/caregiver/session/share/patient']);
  }

  async removeSession(): Promise<void> {
    var response = await this.dialogService.askConfirmation('discardTemplateSessionConfirmation', 'discardTemplateSessionHelp')
      .catch(err => false);
    if (response) {
      if (await this.templateSessionService.removeTemplateSession(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.appContext.templateSessionId,
        this.appContext.patientId)) {
        this.router.navigate([this.appContext.routingBack]);
      }
    }
  }

  openImageDetail(img: PersonalImage, event: Event) {
    event.stopPropagation();
    console.log(img);
    this.dialogService.imagePreview(img);
  }
}