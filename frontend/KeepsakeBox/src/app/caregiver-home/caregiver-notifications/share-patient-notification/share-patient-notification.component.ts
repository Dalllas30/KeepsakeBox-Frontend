/**
 * @author André Santana - fc49451
 */

import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../../core/models/caregiver-notification.model';
import { CaregiverPatientAssociationData } from '../../../core/models/caregiver-patient-association-data.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-share-patient-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './share-patient-notification.component.html',
  styleUrl: './share-patient-notification.component.css',
})
export class SharePatientNotificationComponent implements OnInit {
  public relationsPT = [
    'Esposa/Esposo','Mãe/Pai','Avó/Avô','Irmã/Irmão','Namorada/Namorado','Tia/Tio',
    'Prima/Primo','Filha/Filho','Sobrinha/Sobrinho','Neta/Neto','Familiar','Amiga/Amigo'
  ]

  public relationsENG = [
    'Spouse','Mother/Father','Grandmother/Grandfather','Sister/Brother','Boyfriend/Girlfriend','Aunt/Uncle',
    'Cousin','Daughter/Son','Niece/Nephew','Granddaughter/Grandson','Relative','Friend'
  ]

  @Input() notification!: CaregiverNotification;
  @Output() notificationsChanged: EventEmitter<boolean> = new EventEmitter();

  public caregiver!: Caregiver;
  public associationData!: CaregiverPatientAssociationData;
  public acceptingPatient: boolean = false;
  public translateCache: string;

  private appService = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private caregiverService = inject(CaregiverService);
  private patientService = inject(PatientService);
  private router = inject(Router);

  constructor() {
    this.translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';
  }

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.associationData = new CaregiverPatientAssociationData(
      this.notification.receiver.id,
      this.notification.patient.id,
      ''
    );
    this.acceptingPatient = false;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async acceptSharePatient() {
    this.acceptingPatient = true;
    if (await this.caregiverService.sharePatient(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.associationData
    )) {
      if (await this.notificationService.deleteNotification(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.notification.id
      )) {
        if (await this.notificationService.notifyAcceptSharePatient(
          this.authenticationService.getCurrentCaregiverToken()!,
          this.notification.sender.email,
          this.notification.patient.id
        )) {
          this.patientService.setCurrentPatient(
            await this.patientService.getPatientById(
              this.authenticationService.getCurrentCaregiverToken()!,
              this.notification.patient.id
            )!
          );
          if (this.patientService.getCurrentPatient() != null) {
            this.router.navigate(['/caregiver/person/info']);
          }
        } else {
          this.acceptingPatient = false;
        }
      } else {
        this.acceptingPatient = false;
      }
    } else {
      this.acceptingPatient = false;
    }
  }

  async deleteNotification() {
    if (await this.notificationService.deleteNotification(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.notification.id
    )) {
      if (await this.notificationService.notifyDenySharePatient(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.notification.sender.email,
        this.notification.patient.id
      )) {
        this.notificationsChanged.emit();
      }
    }
  }
}
