/**
 * @author André Santana - fc49451
 */

/* TODO: migrate ImageService and CategoryService to return Observables:
         ImageService.updatePatientImage/updateCaregiverImage/getPatientImage/getCaregiverImage
         and CategoryService.getCategories still uses .toPromise()
         update updateImage() to subscribe */

import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../core/services/app.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { ImageService } from '../../core/services/image.service';
import { PatientService } from '../../core/services/patient.service';
import { CategoryService } from '../../core/services/category.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { Image } from '../../core/models/image.model';
import { PersonalImage } from '../../core/models/personal-image.model';
import { SimpleCaregiver } from '../../core/models/simple-caregiver.model';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-update-image',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CancelScreenComponent],
  templateUrl: './update-image.component.html',
  styleUrl: './update-image.component.css'
})
export class UpdateImageComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private imageService          = inject(ImageService);
  private patientService        = inject(PatientService);
  private categoryService       = inject(CategoryService);
  private appService            = inject(AppService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  hideCancelScreen  = true;
  hideUpdateScreen01 = false;
  hideUpdateScreen02 = true;

  updating = false;
  updated  = true;

  currentImage: PersonalImage = this.router.getCurrentNavigation()?.extras?.state?.['image']
    ?? new PersonalImage(
        new Image("", "", new SimpleCaregiver("", "", ""), "", "", true, true, "", 0, 0, 0, null, null),
        false
       );

  categories:         string[] = [];
  selectedCategories: string[] = [];
  caregiver!:         Caregiver;

  async ngOnInit(): Promise<void> {
    this.categories         = await this.categoryService.getCategories();
    this.selectedCategories = this.currentImage.image.category.split(", ");
    this.caregiver          = this.caregiverService.getCurrentCaregiver()!;
    inject(ChangeDetectorRef).detectChanges();
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  showCancelScreen(): void {
    this.hideCancelScreen = false; this.hideUpdateScreen01 = true; this.hideUpdateScreen02 = true;
  }

  showUpdateScreen01(): void {
    this.hideCancelScreen = true; this.hideUpdateScreen01 = false; this.hideUpdateScreen02 = true;
  }

  showUpdateScreen02(): void {
    this.hideCancelScreen = true; this.hideUpdateScreen01 = true; this.hideUpdateScreen02 = false;
  }

  navigateToImage(): void {
    const route = this.isRouteActive('caregiver/person/image/update')
      ? '/caregiver/person/image'
      : '/caregiver/profile/image';
    this.router.navigateByUrl(route, { state: { image: this.currentImage } });
  }

  isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  categoryClick(category: string): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  resetSelectedCategories(): void {
    this.selectedCategories = [];
  }

  async updateImage(): Promise<void> {
    this.updating = true;
    this.currentImage.image.category = this.categoryService.parseCategories(this.selectedCategories);
    const token = this.authenticationService.getCurrentCaregiverToken()!;

    if (this.isRouteActive('caregiver/person/image/update')) {
      const patientId = this.patientService.getCurrentPatient()!.id;
      if (await this.imageService.updatePatientImage(token, patientId, this.currentImage)) {
        const image = await this.imageService.getPatientImage(token, patientId, this.currentImage.image.id);
        this.router.navigateByUrl('/caregiver/person/image', { state: { image } });
      } else {
        this.updated  = false;
        this.updating = false;
      }
    } else {
      if (await this.imageService.updateCaregiverImage(token, this.currentImage)) {
        const image = await this.imageService.getCaregiverImage(token, this.currentImage.image.id);
        this.router.navigateByUrl('/caregiver/profile/image', { state: { image } });
      } else {
        this.updated  = false;
        this.updating = false;
      }
    }
  }
}
