/**
 * @author André Santana - fc49451
 */

/* TODO: migrate ImageService to return Observables:
         ImageService.addPatientImage and addCaregiverImage still use .toPromise()
         update updaloadImage() to subscribe */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { CategoryService } from '../../core/services/category.service';
import { ImageService } from '../../core/services/image.service';
import { AppService } from '../../core/services/app.service';
import { Caregiver } from '../../core/models/caregiver.model';
import { AddImageData } from '../../core/models/add-image-data.model';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-add-image',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CancelScreenComponent],
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.css'
})
export class AddImageComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private categoryService       = inject(CategoryService);
  private imageService          = inject(ImageService);
  private appService            = inject(AppService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  //Hides Cancel Screen 
  hideCancel       = true;
  //Hides discard image screen
  hideDiscardImage = true;
  //Hides add screen 1
  hideAddImage1    = false;
  //Hides add screen 2
  hideAddImage2    = true;

  //Image counter for display and manage images
  imageCounter  = 1;
  //Amount of images for display and manage images
  imagesAmount  = 0;

  //Logged caregiver
  caregiver!: Caregiver;
  //Current image appearing for parameter selection and update
  currentImage!: AddImageData;

  //All categories defined for image
  categories:         string[] = [];
  //All categories selected by the user (caregiver) for the current image
  selectedCategories: string[] = [];

  //TRUE if uploading image to the server
  uploadingImage = false;
  //TRUE if image was added succsessfully (before selecting categories)
  imageAdded     = false;
  //TRUE if image was discarded succsessfully (before selecting categories)
  imageDiscarded = false;
  //TRUE if image was added succsessfully and on init
  added          = true;

  constructor() {
    const state = this.router.currentNavigation()?.extras?.state;
    this.imagesAmount = state?.['imagesAmount'] ?? 0;
  }

  async ngOnInit(): Promise<void> {
    this.showAddImage1();
    this.caregiver    = this.caregiverService.getCurrentCaregiver()!;
    this.currentImage = new AddImageData(
      "", "", this.imageService.popImageURL(),
      this.caregiverService.getCurrentCaregiver()!.id, 
      true, false
    );
    this.categories   = await this.categoryService.getCategories();
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  showCancel(): void {
    this.hideCancel = false; 
    this.hideDiscardImage = true;
    this.hideAddImage1 = true; 
    this.hideAddImage2 = true;
  }

  showDiscardImage(): void {
    this.hideCancel = true; 
    this.hideDiscardImage = false;
    this.hideAddImage1 = true; 
    this.hideAddImage2 = true;
  }

  showAddImage1(): void {
    this.hideCancel = true; 
    this.hideDiscardImage = true;
    this.hideAddImage1 = false; 
    this.hideAddImage2 = true;
  }

  showAddImage2(): void {
    this.hideCancel = true; 
    this.hideDiscardImage = true;
    this.hideAddImage1 = true; 
    this.hideAddImage2 = false;
  }

  navigateToImages(): void {
    if (this.appService.isRouteActive('caregiver/person/images/add')) {
      this.router.navigate(['caregiver/person/images']);
    } else {
      this.router.navigate(['caregiver/profile/images']);
    }
  }

  skipImage(): void {
    this.imageAdded    = false;
    this.imageDiscarded = true;
    this.imageCounter++;
    if (this.imageCounter > this.imagesAmount) {
      this.navigateToImages();
    } else {
      this.selectedCategories = [];
      this.currentImage = new AddImageData("", "", this.imageService.popImageURL(),
        this.caregiverService.getCurrentCaregiver()!.id, true, false);
      this.showAddImage1();
    }
  }

  categoryClick(category: string): void {
    this.imageAdded = false;
    this.imageDiscarded = false;
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
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

  async uploadImage(): Promise<void> {
    this.imageAdded    = false;
    this.imageDiscarded = false;
    this.uploadingImage = true;
    this.currentImage.category = this.categoryService.parseCategories(this.selectedCategories);

    const token = this.authenticationService.getCurrentCaregiverToken()!;
    let success: boolean;

    if (this.appService.isRouteActive('caregiver/person/images/add')) {
      success = await this.imageService.addPatientImage(
        token, this.patientService.getCurrentPatient()!.id, this.currentImage);
    } else {
      success = await this.imageService.addCaregiverImage(token, this.currentImage);
    }

    if (success) {
      this.uploadingImage = false;
      if (this.imageCounter === this.imagesAmount) {
        this.navigateToImages();
      } else {
        this.imageCounter++;
        this.selectedCategories = [];
        this.currentImage = new AddImageData("", "", this.imageService.popImageURL(),
          this.caregiverService.getCurrentCaregiver()!.id, true, false);
        this.imageAdded = true;
        this.showAddImage1();
      }
    } else {
      this.added          = false;
      this.uploadingImage = false;
    }
  }
}
