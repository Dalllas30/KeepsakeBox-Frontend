import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Patient } from '../../core/models/patient.model';
import { AppService } from '../../core/services/app.service';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterOutlet, RouterLink],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  public patient!: Patient;

  constructor(
    private appService: AppService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patient = this.patientService.getCurrentPatient()!;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  /**
   * Returns true when the active child route is a standalone "overlay"
   * page that should fill the viewport on its own, without the patient
   * card and tab nav wrapping it.
   */
  hideNavBar(): boolean {
    return this.isRouteActive('person/info/update') ||
      this.isRouteActive('person/images/add') ||
      this.isRouteActive('person/image/update') ||
      this.isRouteActive('person/image/delete') ||
      this.isRouteActive('person/images/method') ||
      this.isRouteActive('person/observations/add') ||
      this.isRouteActive('person/observations/update') ||
      this.isRouteActive('person/observations/delete') ||
      this.isRouteActive('person/share') ||
      this.isRouteActive('person/leave') ||
      this.isRouteActive('person/primary/leave') ||
      this.isRouteActive('person/caregiver/remove');
  }
}