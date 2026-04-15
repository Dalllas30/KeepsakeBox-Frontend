import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SessionFeedback } from '../../../core/models/session-feedback.model';
import { Session } from '../../../core/models/session.model';
import { AppContext } from '../../../core/models/app-context.model';
import { Patient } from '../../../core/models/patient.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { DialogService } from '../../../core/services/dialog.service';
import { PatientService } from '../../../core/services/patient.service';
import { RtSessionService } from '../../../core/services/rt-session.service';

@Component({
  selector: 'app-rt-session-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rt-session-feedback.component.html',
  styleUrls: ['./rt-session-feedback.component.css']
})
export class RtSessionFeedbackComponent implements OnInit {

  public symptoms: string[] = [];
  public symptoms_value: any = {};

  @Input() generalFeedback = 0;
  @Input() agressivity = "No";
  @Input() sadness = "No";
  @Input() isolation = "No";
  @Input() patient_observation = "";
  @Input() pageStatus = "";

  public sessionFeedback!: SessionFeedback;
  public updating: boolean = false;
  public updated: boolean = false;
  public session!: Session;
  public sessionDuration!: number;
  public appContext!: AppContext;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private rtSessionService: RtSessionService,
    private patientService: PatientService,
    private appService: AppService,
    private dialogService: DialogService
  ) {}

  async ngOnInit(): Promise<void> {
    this.appContext = this.appService.getAppContext()!;
    this.session = this.rtSessionService.getCurrentSession()!;
    this.sessionDuration = this.rtSessionService.getCurrentDuration()!;
    this.pageStatus = this.appService.getPageStatus()!;
    this.resetfeedback(true);
    this.sessionFeedback = (await this.rtSessionService.getSessionFeedback(
      this.authenticationService.getCurrentCaregiverToken()!, this.session.id))!;
    if (this.sessionFeedback.session_id == null) {
      this.sessionFeedback = new SessionFeedback('', this.session.id, '', new Date(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', this.sessionDuration);
    } else {
      this.sessionFeedback.duration = this.sessionDuration;
    }

    this.setGeneralFeedback(0, this.sessionFeedback.patient_feedback);
    if (this.sessionFeedback.anxiety == 1) { this.symptoms_value["anxiety"] = "Yes"; }
    if (this.sessionFeedback.agressivity == 1) { this.symptoms_value["agitation_agression"] = "Yes"; }
    if (this.sessionFeedback.irritability == 1) { this.symptoms_value["irritability_lability"] = "Yes"; }
    if (this.sessionFeedback.apathy == 1) { this.symptoms_value["apathy"] = "Yes"; }
    if (this.sessionFeedback.joy == 1) { this.symptoms_value["joy_happiness"] = "Yes"; }
    if (this.sessionFeedback.enthusiasm == 1) { this.symptoms_value["enthusiasm"] = "Yes"; }
    if (this.sessionFeedback.communication == 1) { this.symptoms_value["communication"] = "Yes"; }
    if (this.sessionFeedback.commitment == 1) { this.symptoms_value["commitment"] = "Yes"; }

    this.patient_observation = this.sessionFeedback.patient_observation;
    this.updated = true;
    this.updating = false;
  }

  setGeneralFeedback(oldGeneralFeedback: number, generalFeedback: number) {
    this.generalFeedback = generalFeedback;
    if ((oldGeneralFeedback != 2 && generalFeedback == 1) || (oldGeneralFeedback != 1 && generalFeedback == 2)) {
      this.symptoms = [];
      this.symptoms.push("anxiety", "agitation_agression", "irritability_lability", "apathy");
    } else if (generalFeedback == 0 || generalFeedback == 3) {
      this.symptoms = [];
    } else if ((oldGeneralFeedback != 5 && generalFeedback == 4) || (oldGeneralFeedback != 4 && generalFeedback == 5)) {
      this.symptoms = [];
      this.symptoms.push("joy_happiness", "enthusiasm", "communication", "commitment");
    }
  }

  saveFeedbackToSessionFeedback() {
    this.sessionFeedback.patient_feedback = this.generalFeedback;
    this.sessionFeedback.patient_observation = this.patient_observation;

    if (this.sessionFeedback.patient_feedback > 0 && this.sessionFeedback.patient_feedback < 3) {
      this.sessionFeedback.anxiety = this.symptoms_value["anxiety"] == "Yes" ? 1 : this.symptoms_value["anxiety"] == "No" ? 0 : -1;
      this.sessionFeedback.agressivity = this.symptoms_value["agitation_agression"] == "Yes" ? 1 : this.symptoms_value["agitation_agression"] == "No" ? 0 : -1;
      this.sessionFeedback.irritability = this.symptoms_value["irritability_lability"] == "Yes" ? 1 : this.symptoms_value["irritability_lability"] == "No" ? 0 : -1;
      this.sessionFeedback.apathy = this.symptoms_value["apathy"] == "Yes" ? 1 : this.symptoms_value["apathy"] == "No" ? 0 : -1;
      this.sessionFeedback.joy = -1;
      this.sessionFeedback.enthusiasm = -1;
      this.sessionFeedback.communication = -1;
      this.sessionFeedback.commitment = -1;
    } else if (this.sessionFeedback.patient_feedback > 3 && this.sessionFeedback.patient_feedback < 6) {
      this.sessionFeedback.joy = this.symptoms_value["joy_happiness"] == "Yes" ? 1 : this.symptoms_value["joy_happiness"] == "No" ? 0 : -1;
      this.sessionFeedback.enthusiasm = this.symptoms_value["enthusiasm"] == "Yes" ? 1 : this.symptoms_value["enthusiasm"] == "No" ? 0 : -1;
      this.sessionFeedback.communication = this.symptoms_value["communication"] == "Yes" ? 1 : this.symptoms_value["communication"] == "No" ? 0 : -1;
      this.sessionFeedback.commitment = this.symptoms_value["commitment"] == "Yes" ? 1 : this.symptoms_value["commitment"] == "No" ? 0 : -1;
      this.sessionFeedback.anxiety = -1;
      this.sessionFeedback.agressivity = -1;
      this.sessionFeedback.irritability = -1;
      this.sessionFeedback.apathy = -1;
    } else {
      this.sessionFeedback.anxiety = -1;
      this.sessionFeedback.agressivity = -1;
      this.sessionFeedback.irritability = -1;
      this.sessionFeedback.apathy = -1;
      this.sessionFeedback.joy = -1;
      this.sessionFeedback.enthusiasm = -1;
      this.sessionFeedback.communication = -1;
      this.sessionFeedback.commitment = -1;
    }
  }

  async interuptSession() {
    this.updating = true;
    this.saveFeedbackToSessionFeedback();
    if (await this.rtSessionService.updateSessionFeedback(
      this.authenticationService.getCurrentCaregiverToken()!, this.sessionFeedback)) {
      this.updated = true;
      this.updating = false;
      this.router.navigate([this.appContext.routingBack]);
    } else {
      this.updated = false;
      this.updating = false;
    }
  }

  async finishSession() {
    var response = await this.dialogService.askConfirmation('finishSessionConfirmation', 'finishSessionHelp')
      .catch(err => false);
    if (response) {
      if (this.generalFeedback != 0) {
        this.updating = true;
        this.saveFeedbackToSessionFeedback();
        if (await this.rtSessionService.finishSession(
          this.authenticationService.getCurrentCaregiverToken()!,
          this.session.template_id,
          this.appContext.patientId,
          this.sessionFeedback)) {
          this.updated = true;
          this.updating = false;
          this.dialogService.showSuccessNotification('As reações da sessão como um todo foram guardadas com sucesso!');
          this.router.navigate([this.appContext.routingBack]);
        } else {
          this.updated = false;
          this.updating = false;
          this.dialogService.showErrorNotification('As reações da sessão como um todo foram guardadas sem sucesso!');
        }
      }
    }
  }

  async backToSession() {
    this.updating = true;
    this.saveFeedbackToSessionFeedback();
    if (await this.rtSessionService.updateSessionDuration(
      this.authenticationService.getCurrentCaregiverToken()!, this.sessionFeedback)) {
      this.updated = true;
      this.updating = false;
      this.router.navigate(['/caregiver/session/running']);
    } else {
      this.updated = false;
      this.updating = false;
    }
  }

  async cancelFeedbackFromList() {
    var response = await this.dialogService.askConfirmation('abortFinishSessionConfirmation', 'abortFinishSessionHelp')
      .catch(err => false);
    if (response) {
      this.router.navigate([this.appContext.routingBack]);
    }
  }

  async resetfeedback(force: boolean = false) {
    var response = true;
    if (!force) {
      response = await this.dialogService.askConfirmation('clearFeedbackConfirmation', 'clearFeedbackHelp')
        .catch(err => false);
    }
    if (response) {
      this.symptoms = [];
      this.generalFeedback = 0;
      this.symptoms_value["anxiety"] = "No";
      this.symptoms_value["agitation_agression"] = "No";
      this.symptoms_value["irritability_lability"] = "No";
      this.symptoms_value["apathy"] = "No";
      this.symptoms_value["joy_happiness"] = "No";
      this.symptoms_value["enthusiasm"] = "No";
      this.symptoms_value["communication"] = "No";
      this.symptoms_value["commitment"] = "No";
      this.patient_observation = "";
      this.agressivity = "No";
      this.isolation = "No";
      this.sadness = "No";
    }
  }
}