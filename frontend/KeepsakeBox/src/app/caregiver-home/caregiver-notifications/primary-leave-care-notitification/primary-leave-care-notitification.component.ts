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
  selector: 'app-primary-leave-care-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './primary-leave-care-notitification.component.html',
  styleUrl: './primary-leave-care-notitification.component.css',
})
export class PrimaryLeaveCareNotificationComponent implements OnInit {
  @Input() notification!: CaregiverNotification;
  @Output() notificationsChanged: EventEmitter<boolean> = new EventEmitter();

  public caregiver!: Caregiver;
  public executingRequest: boolean = false;

  private appService = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private caregiverService = inject(CaregiverService);
  private patientService = inject(PatientService);
  private router = inject(Router);

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.executingRequest = false;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async acceptPrimaryCare() {
    this.executingRequest = true;
    if (await this.caregiverService.leavePrimaryCare(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.notification.sender.id,
      this.notification.patient.id
    )) {
      if (await this.notificationService.deleteNotification(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.notification.id
      )) {
        if (await this.notificationService.notifyAcceptPrimaryLeaveCare(
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
          this.executingRequest = false;
        }
      } else {
        this.executingRequest = false;
      }
    } else {
      this.executingRequest = false;
    }
  }

  async deleteNotification() {
    if (await this.notificationService.deleteNotification(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.notification.id
    )) {
      if (await this.notificationService.notifyDenyPrimaryLeaveCare(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.notification.sender.email,
        this.notification.patient.id
      )) {
        this.notificationsChanged.emit();
      }
    }
  }
}
