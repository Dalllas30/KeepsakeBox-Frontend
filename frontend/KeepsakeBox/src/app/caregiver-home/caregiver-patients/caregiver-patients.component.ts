import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Patient } from '../../core/models/patient.model';
import { Caregiver } from '../../core/models/caregiver.model';
import { AppService } from '../../core/services/app.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { NotificationService } from '../../core/services/notification.service';
import { CategoryService } from '../../core/services/category.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-caregiver-patients',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, NgbPaginationModule],
  templateUrl: './caregiver-patients.component.html',
  styleUrls: ['./caregiver-patients.component.css']
})
export class CaregiverPatientsComponent implements OnInit {
  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;

  public hasNewNotifications: boolean = false;
  public caregiver!: Caregiver;
  public pList: Patient[] = [];
  public pListCopy: Patient[] = [];
  public collectionSize: number = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private appService: AppService,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.retrievePatients();
    this.checkNotifications();
  }

  async retrievePatients(): Promise<void> {
    this.pList = await this.caregiverService.getCaregiverPatients(this.authenticationService.getCurrentCaregiverToken()!) ?? [];
    this.pListCopy = this.pList;
    this.collectionSize = this.pList.length;
    this.cdr.detectChanges();
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async checkNotifications() {
    try {
      this.hasNewNotifications = false;
      let notifications = await this.notificationService
        .getCaregiverNotifications(this.authenticationService.getCurrentCaregiverToken()!);
      for (let n of notifications) {
        if (n.receiver.email == this.caregiver.email) {
          this.hasNewNotifications = true;
        }
      }
    } catch {
      this.hasNewNotifications = false;
    }
  }

  searchPatientByName(event: Event) {
    this.pList = this.pListCopy;
    const filterValue = (event.target as HTMLInputElement).value;
    this.pList = this.pList.filter(
      patient => patient.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                 patient.displayName.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.collectionSize = this.pList.length;
  }

  async goToPatientProfile(patient: Patient) {
    this.patientService.resetCurrentPatient();
    await this.patientService.setCurrentPatient(patient);
    this.router.navigate(['caregiver/person/info']);
  }

  async goToPatientMessages(patient: Patient) {
    this.patientService.resetCurrentPatient();
    await this.patientService.setCurrentPatient(patient);
    this.router.navigate(['caregiver/person/messages']);
  }

  async goToRtSession(patient: Patient) {
    this.patientService.resetCurrentPatient();
    await this.patientService.setCurrentPatient(patient);
    this.router.navigate(['/caregiver/person/rtSessionStartlist']);
  }
}