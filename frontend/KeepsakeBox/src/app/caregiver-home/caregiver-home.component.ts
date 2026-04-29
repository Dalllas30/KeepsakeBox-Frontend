import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../core/services/app.service';
import { CaregiverService } from '../core/services/caregiver.service';
import { PatientService } from '../core/services/patient.service';
import { Caregiver } from '../core/models/caregiver.model';
import { Patient } from '../core/models/patient.model';

@Component({
  selector: 'app-caregiver-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './caregiver-home.component.html',
  styleUrls: ['./caregiver-home.component.css']
})
export class CaregiverHomeComponent implements OnInit {
  public caregiver!: Caregiver;
  public patient!: Patient;
  public linkBackwards!: string;

  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private appService: AppService,
    private patientService: PatientService,
    private caregiverService: CaregiverService
  ) {}

  ngOnInit(): void {
    // Subscribe reactively so any field change (type, name, future colour theme, etc.)
    // is reflected immediately without needing to re-navigate or reload.
    this.caregiverService.getCurrentCaregiver$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(caregiver => {
        if (caregiver) this.caregiver = caregiver;
      });

    this.patient = this.patientService.getCurrentPatient()!;
  }

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  hideNavBar(): boolean {
    return this.isRouteActive('caregiver/persons/add') ||
      this.isRouteActive('caregiver/profile/update') ||
      this.isRouteActive('caregiver/profile/password') ||
      this.isRouteActive('caregiver/person/observations/add') ||
      this.isRouteActive('caregiver/person/observations/delete') ||
      this.isRouteActive('caregiver/person/observations/update') ||
      this.isRouteActive('caregiver/person/images/add') ||
      this.isRouteActive('caregiver/profile/images/add') ||
      this.isRouteActive('caregiver/person/image/update') ||
      this.isRouteActive('caregiver/profile/image/update') ||
      this.isRouteActive('caregiver/person/image/delete') ||
      this.isRouteActive('caregiver/profile/image/delete') ||
      this.isRouteActive('caregiver/person/share') ||
      this.isRouteActive('caregiver/person/leave') ||
      this.isRouteActive('caregiver/person/primary/leave') ||
      this.isRouteActive('caregiver/person/caregiver/remove') ||
      this.isRouteActive('caregiver/person/info/update') ||
      this.isRouteActive('logout');
  }

  hideNavBarCaregiver(): boolean {
    // Hide the main caregiver nav for all session-related routes AND overlay pages
    return this.hideNavBar();
  }

  hideNavBarRtSession(): boolean {
    // Hide the RT session nav only for overlay pages and the fullscreen running/feedback screens
    // (NOT for session/home, session/categories, etc. — those should show the RT nav)
    return this.hideNavBar() ||
      this.isRouteActive('caregiver/session/running') ||
      this.isRouteActive('caregiver/session/feedback');
  }

  navigateBack() {
    if (this.linkBackwards == null) {
      this.router.navigate(['/caregiver/person/info']);
    } else {
      this.router.navigate([this.linkBackwards]);
    }
  }
}