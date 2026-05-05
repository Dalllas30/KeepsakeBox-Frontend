import { Component, Input, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { PersonalImage } from '../../../core/models/personal-image.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { RtSessionService } from '../../../core/services/rt-session.service';
import { RtSessionImageService } from '../../../core/services/rt-session-image.service';
import { RtSessionImage } from '../../../core/models/rt-session-image.model';
import { Session } from '../../../core/models/session.model';
import { DialogService } from '../../../core/services/dialog.service';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-rt-session-running',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule], // RouterLink?
  templateUrl: './rt-session-running.component.html',
  styleUrls: ['./rt-session-running.component.css']
})
export class RtSessionRunningComponent implements OnInit {

  @Input() PreviousImage = false;
  @Input() NextImage = false;
  @Input() NextButtonRight = 0;
  @Input() generalFeedback = 0;
  AlertMessage = false;
  selectedPanelWidth = 25;
  selectedSplitPanel = 1;
  selectedAutoSave = 0;
  @Input() panelWidth = 0;
  @Input() mainWidth = 100;
  configPanel = "margin-top: 0.2em; margin-left: 0.5em; font-size: 0.75em; font-weight: ";
  @Input() configPanel25 = this.configPanel + "bold";
  @Input() configPanel50 = this.configPanel + "normal";
  @Input() configPanelFull = this.configPanel + "normal";
  @Input() configPanelSplit = this.configPanel + "bold";
  @Input() configPanelFloating = this.configPanel + "normal";
  @Input() configPanelAutoSave = this.configPanel + "normal";
  @Input() first = 0;
  @Input() last = 5;

  private YES: string = "Yes";
  private NO: string = "No";
  private NOTHING: string = "No";

  @Input() anxiety = this.NOTHING;
  @Input() agressivity = this.NOTHING;
  @Input() irritability = this.NOTHING;
  @Input() apathy = this.NOTHING;
  @Input() joy = this.NOTHING;
  @Input() enthusiasm = this.NOTHING;
  @Input() communication = this.NOTHING;
  @Input() commitment = this.NOTHING;

  @Input() isConfigPanelOpen = false;
  isOpenFeedbackPanel = false;
  public hideOptions!: boolean;
  public hideFilter!: boolean;
  @Input() n_image = 1;
  @Input() page = 1;
  @Input() pageSize = 1;
  @Input() maxSize = 3;

  public caregiver!: Caregiver;
  public patient!: Patient;
  public session!: Session;
  public loadingImage!: boolean;
  public loadingFolder!: boolean;
  public loadingImages!: boolean;
  public images!: PersonalImage[];
  public rtSessionImage!: RtSessionImage;
  @Input() imageURL = "";
  @Input() current_image = 0;
  @Input() total_images = 0;
  public imagesCopy!: PersonalImage[];
  public imagesByCategory!: PersonalImage[];
  public imagesByFavorite!: PersonalImage[];
  public collectionSize!: number;
  public selectedCategories!: string[];
  public onlyFavorites!: boolean;
  public updated!: boolean;
  public updating!: boolean;
  public startTime!: number;

  constructor(
    private router: Router,
    private imageService: ImageService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private rtSessionService: RtSessionService,
    private rtSessionImageService: RtSessionImageService,
    private patientService: PatientService,
    private dialogService: DialogService,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingImage = false;
    this.loadingFolder = false;
    this.selectedCategories = [];
    this.onlyFavorites = false;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    this.session = this.rtSessionService.getCurrentSession()!;
    this.rtSessionImage = new RtSessionImage("", "", "", 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, "", 0, 0, 0, "");
    await this.getRtSessionImage(this.session.id, "Current");
    this.updated = true;
    this.updating = false;
    this.startTime = Date.now();
    if (window.innerWidth < 1080) {
      this.selectedPanelWidth = 50;
    } else {
      this.selectedPanelWidth = 25;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log("width:" + window.innerWidth);
    if (window.innerWidth < 1080) {
      this.selectedPanelWidth = 50;
    } else {
      this.selectedPanelWidth = 25;
    }
  }

  async getRtSessionImage(sessionId: string, direction: string): Promise<void> {
    this.loadingImages = true;
    this.rtSessionImage = (await this.rtSessionImageService.getRtSessionImage(
      this.authenticationService.getCurrentCaregiverToken()!, sessionId, direction))!;

    this.generalFeedback = this.rtSessionImage.patient_feedback;

    const mapValue = (val: number) => val === 1 ? this.YES : val === 0 ? this.NO : this.NOTHING;
    this.anxiety = mapValue(this.rtSessionImage.anxiety);
    this.agressivity = mapValue(this.rtSessionImage.agressivity);
    this.irritability = mapValue(this.rtSessionImage.irritability);
    this.apathy = mapValue(this.rtSessionImage.apathy);
    this.joy = mapValue(this.rtSessionImage.joy);
    this.enthusiasm = mapValue(this.rtSessionImage.enthusiasm);
    this.communication = mapValue(this.rtSessionImage.communication);
    this.commitment = mapValue(this.rtSessionImage.commitment);

    this.loadingImages = false;
    this.PreviousImage = this.rtSessionImage.current_image > 1;
    this.NextImage = this.rtSessionImage.current_image < this.rtSessionImage.total_images;
    this.NextButtonRight = 0;
    this.cdr.detectChanges();
  }

  async NavigateToNextImage() {
    var goToNextStep = true;
    if (this.isOpenFeedbackPanel) {
      if (this.selectedAutoSave == 1) {
        this.saveFeedbackPanel();
      } else {
        this.AlertMessage = true;
        goToNextStep = false;
      }
    }
    if (goToNextStep) {
      this.loadingImages = true;
      await this.getRtSessionImage(this.session.id, "Next");
      this.loadingImages = false;
    }
  }

  async NavigateToPreviousImage() {
    var goToNextStep = true;
    if (this.isOpenFeedbackPanel) {
      if (this.selectedAutoSave == 1) {
        this.saveFeedbackPanel();
      } else {
        this.AlertMessage = true;
        goToNextStep = false;
      }
    }
    if (goToNextStep) {
      this.loadingImages = true;
      await this.getRtSessionImage(this.session.id, "Previous");
      this.loadingImages = false;
    }
  }

  async OpenImageFeedback() {
    this.panelWidth = this.selectedPanelWidth;
    this.mainWidth = 100 - (this.panelWidth * this.selectedSplitPanel);
    this.isOpenFeedbackPanel = true;
    if (this.selectedSplitPanel == 1) {
      this.NextButtonRight = this.selectedPanelWidth == 25 ? 25 : this.selectedPanelWidth == 50 ? 50 : 0;
    } else {
      this.NextButtonRight = 0;
    }
  }

  async closeFeedbackPanel() {
    this.panelWidth = 0;
    this.mainWidth = 100;
    this.isConfigPanelOpen = false;
    this.isOpenFeedbackPanel = false;
    this.AlertMessage = false;
    this.NextButtonRight = 0;
  }

  async saveFeedbackPanel() {
    const mapSymptom = (val: string) => val === this.YES ? 1 : val === this.NO ? 0 : -1;

    if (this.generalFeedback > 0 && this.generalFeedback < 3) {
      this.rtSessionImage.anxiety = mapSymptom(this.anxiety);
      this.rtSessionImage.agressivity = mapSymptom(this.agressivity);
      this.rtSessionImage.irritability = mapSymptom(this.irritability);
      this.rtSessionImage.apathy = mapSymptom(this.apathy);
      this.rtSessionImage.joy = -1;
      this.rtSessionImage.enthusiasm = -1;
      this.rtSessionImage.communication = -1;
      this.rtSessionImage.commitment = -1;
    } else if (this.generalFeedback == 3 || this.generalFeedback == 0) {
      this.rtSessionImage.anxiety = -1;
      this.rtSessionImage.agressivity = -1;
      this.rtSessionImage.irritability = -1;
      this.rtSessionImage.apathy = -1;
      this.rtSessionImage.joy = -1;
      this.rtSessionImage.enthusiasm = -1;
      this.rtSessionImage.communication = -1;
      this.rtSessionImage.commitment = -1;
    } else if (this.generalFeedback > 3) {
      this.rtSessionImage.joy = mapSymptom(this.joy);
      this.rtSessionImage.enthusiasm = mapSymptom(this.enthusiasm);
      this.rtSessionImage.communication = mapSymptom(this.communication);
      this.rtSessionImage.commitment = mapSymptom(this.commitment);
      this.rtSessionImage.anxiety = -1;
      this.rtSessionImage.agressivity = -1;
      this.rtSessionImage.irritability = -1;
      this.rtSessionImage.apathy = -1;
    }

    this.updateRtSessionImageFeedback();
    if (this.updated) {
      this.closeFeedbackPanel();
    }
  }

  async openConfigPanel() {
    this.isConfigPanelOpen = !this.isConfigPanelOpen;
  }

  async configFeedbackPanel(param: String) {
    if (param == '25%') {
      this.selectedPanelWidth = 25;
      this.configPanel25 = this.configPanel + "bold";
      this.configPanel50 = this.configPanel + "normal";
      this.configPanelFull = this.configPanel + "normal";
    }
    if (param == '50%') {
      this.selectedPanelWidth = 50;
      this.configPanel25 = this.configPanel + "normal";
      this.configPanel50 = this.configPanel + "bold";
      this.configPanelFull = this.configPanel + "normal";
    }
    if (param == 'full') {
      this.selectedPanelWidth = 100;
      this.configPanel25 = this.configPanel + "normal";
      this.configPanel50 = this.configPanel + "normal";
      this.configPanelFull = this.configPanel + "bold";
    }
    if (param == 'split') {
      this.selectedSplitPanel = 1;
      this.configPanelSplit = this.configPanel + "bold";
      this.configPanelFloating = this.configPanel + "normal";
    }
    if (param == 'floating') {
      this.selectedSplitPanel = 0;
      this.configPanelSplit = this.configPanel + "normal";
      this.configPanelFloating = this.configPanel + "bold";
    }
    if (param == 'autoSave') {
      if (this.selectedAutoSave == 1) {
        this.selectedAutoSave = 0;
        this.configPanelAutoSave = this.configPanel + "normal";
      } else {
        this.selectedAutoSave = 1;
        this.configPanelAutoSave = this.configPanel + "bold";
      }
    }
    this.OpenImageFeedback();
  }

  async updateRtSessionImageFeedback() {
    this.updating = true;
    this.rtSessionImage.patient_feedback = this.generalFeedback;
    if (await this.rtSessionImageService.updateRtSessionImageFeedback(
      this.authenticationService.getCurrentCaregiverToken()!, this.rtSessionImage)) {
      this.updated = true;
      this.updating = false;
    } else {
      this.updated = false;
      this.updating = false;
    }
  }

  terminateSession(action: string) {
    var duration = Math.round((Date.now() - this.startTime) / 1000);
    this.rtSessionService.resetCurrentDuration();
    this.rtSessionService.setCurrentDuration(duration);
    this.appService.resetPageStatus();
    this.appService.setPageStatus(action);
    this.router.navigate(['/caregiver/session/feedback']);
  }

  async resetfeedback() {
    var response = await this.dialogService.askConfirmation('clearFeedbackConfirmation', 'clearFeedbackHelp')
      .catch(err => false);
    if (response) {
      this.generalFeedback = 0;
      this.anxiety = this.NO;
      this.agressivity = this.NO;
      this.irritability = this.NO;
      this.apathy = this.NO;
      this.joy = this.NO;
      this.enthusiasm = this.NO;
      this.communication = this.NO;
      this.commitment = this.NO;
      this.rtSessionImage.observation = "";
    }
  }
}