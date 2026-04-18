import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../../core/models/caregiver-notification.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-primary-care-transfer-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './primary-care-transfer-notification.component.html',
  styleUrl: './primary-care-transfer-notification.component.css',
})
export class PrimaryCareTransferNotificationComponent implements OnInit {
  @Input() notification!: CaregiverNotification;
  @Output() notificationsChanged: EventEmitter<boolean> = new EventEmitter();

  public caregiver!: Caregiver;
  public acceptingPrimaryCare: boolean = false;

  private appService = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private caregiverService = inject(CaregiverService);
  private patientService = inject(PatientService);
  private router = inject(Router);

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.acceptingPrimaryCare = false;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async acceptPrimaryCare() {
    this.acceptingPrimaryCare = true;
    if (await this.caregiverService.newPrimaryCaregiver(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.notification.sender.id,
      this.notification.patient.id
    )) {
      if (await this.notificationService.deleteNotification(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.notification.id
      )) {
        if (await this.notificationService.notifyAcceptPrimaryCarePatient(
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
          this.acceptingPrimaryCare = false;
        }
      } else {
        this.acceptingPrimaryCare = false;
      }
    } else {
      this.acceptingPrimaryCare = false;
    }
  }

  async deleteNotification() {
    if (await this.notificationService.deleteNotification(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.notification.id
    )) {
      if (await this.notificationService.notifyDenyPrimaryCarePatient(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.notification.sender.email,
        this.notification.patient.id
      )) {
        this.notificationsChanged.emit();
      }
    }
  }
}
