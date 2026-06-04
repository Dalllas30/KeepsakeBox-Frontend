/**
 * @author André Santana - fc49451
 */

/* TODO: migrate ImageService to return Observables:
         ImageService.deletePatientImage and deleteCaregiverImage still use .toPromise()
         update deleteImage() to subscribe */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { ImageService } from '../../core/services/image.service';
import { AppService } from '../../core/services/app.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { Patient } from '../../core/models/patient.model';
import { PersonalImage } from '../../core/models/personal-image.model';
import { Image } from '../../core/models/image.model';
import { SimpleCaregiver } from '../../core/models/simple-caregiver.model';

@Component({
  selector: 'app-delete-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './delete-image.component.html',
  styleUrl: './delete-image.component.css'
})
export class DeleteImageComponent implements OnInit {
  private router                = inject(Router);
  private appService            = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private imageService          = inject(ImageService);

  hideDeleteImage  = false;
  hideImageDeleted = true;

  caregiver!: Caregiver;
  patient!: Patient;
  img: PersonalImage;

  deleting = false;
  deleted  = true;

  constructor() {
    const state = this.router.currentNavigation()?.extras?.state;
    this.img = state?.['image'] ?? new PersonalImage(
      new Image("", "", new SimpleCaregiver("", "", ""),
        "", "", true, true, "", 0, 0, 0, null, null),
      false
    );
  }

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient   = this.patientService.getCurrentPatient()!;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  navigateToImage(): void {
    const url = this.isRouteActive('caregiver/person/image/delete')
      ? '/caregiver/person/image'
      : '/caregiver/profile/image';
    this.router.navigateByUrl(url, { state: { image: this.img } });
  }

  navigateToImages(): void {
    const url = this.isRouteActive('caregiver/person/image/delete')
      ? '/caregiver/person/images'
      : '/caregiver/profile/images';
    this.router.navigateByUrl(url);
  }

  async deleteImage(): Promise<void> {
    this.deleting = true;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    let success: boolean;

    if (this.isRouteActive('caregiver/person/image/delete')) {
      success = await this.imageService.deletePatientImage(
        token, this.patientService.getCurrentPatient()!.id, this.img.image.id);
    } else {
      success = await this.imageService.deleteCaregiverImage(token, this.img.image.id);
    }

    if (success) {
      this.deleting = false;
      this.hideDeleteImage  = true;
      this.hideImageDeleted = false;
    } else {
      this.deleted  = false;
      this.deleting = false;
    }
  }
}
