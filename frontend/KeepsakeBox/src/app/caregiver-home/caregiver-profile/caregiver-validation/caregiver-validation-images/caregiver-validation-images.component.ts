import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AddImageData } from '../../../../core/models/add-image-data.model';
import { FoundImage, ImageToValidate } from '../../../../core/models/image.model';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ImageService } from '../../../../core/services/image.service';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-caregiver-validation-images',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule],
  templateUrl: './caregiver-validation-images.component.html',
  styleUrls: ['./caregiver-validation-images.component.css']
})
export class CaregiverValidationImagesComponent implements OnInit {
  @Input() page = 1;
  @Input() pageSize = 5;
  @Input() maxSize = 3;
  public collectionSize: number = 5;
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public validationActive: boolean = false;
  public discardActive: boolean = false;
  public tabAcceptedActive: boolean = true;
  public hideCancel: boolean = true;
  public validationDialogActive: boolean = false;
  public acceptedArray: any[] = [];
  public rejectedArray: any[] = [];
  public todayDate!: string;
  public validationActiveStorage: boolean = false;
  public foundPhotos!: FoundImage[];
  public validationActiveAutoSearch!: boolean;
  public activeArray: any;
  public imagesToValidate!: ImageToValidate[];
  public acceptanceMap: Map<string, boolean> = new Map();

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private authenticationService: AuthenticationService,
    private imageService: ImageService,
    private patientService: PatientService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { photos: FoundImage[], validationActive: boolean, imagesToValidate: ImageToValidate[] };
    this.foundPhotos = state?.photos;
    this.validationActiveAutoSearch = state?.validationActive;
    this.imagesToValidate = state?.imagesToValidate;
  }

  ngOnInit(): void {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    this.todayDate = `${dd}/${mm}/${today.getFullYear()}`;

    if (this.validationActiveAutoSearch) {
      this.validationActive = true;
      this.activeArray = this.foundPhotos;
      this.activeArray.forEach((photo: any) => {
        if (photo.acceptance) { this.acceptedArray.push(photo); this.acceptanceMap.set(photo.src, photo.acceptance); }
        else { this.rejectedArray.push(photo); this.acceptanceMap.set(photo.src, photo.acceptance); }
      });
    } else {
      this.activeArray = this.imagesToValidate;
      this.activeArray.forEach((element: any) => {
        if (this.clarifaiCheck(element)) this.acceptedArray.push(element);
        else this.rejectedArray.push(element);
      });
    }
  }

  translateLabels(categories: string): string { return this.categoryService.categoriesTranslation(categories, this.translateCache); }
  translateLabel(category: string): string { return this.categoryService.categoryTranslation(category, this.translateCache); }
  showCancel() { this.hideCancel = false; }
  navigateToCaregiverValidation(): void { this.router.navigate(['/caregiver/profile/validation']); }
  goToValidationDialog() { this.validationDialogActive = true; }
  leaveValidationDialog() { this.validationDialogActive = false; }
  goToDiscardDialog() { this.discardActive = true; }
  leaveDiscardDialog() { this.discardActive = false; }
  goToValidationInterface() { this.validationActive = true; }
  leaveValidationInterface() { this.validationActive = false; this.validationDialogActive = false; }
  leaveValidationInterfaceConfirm() { this.validationActive = false; this.validationDialogActive = false; this.uploadImage(this.acceptedArray); }
  changeTabToRejected() { this.tabAcceptedActive = false; }
  changeTabToAccepted() { this.tabAcceptedActive = true; }

  acceptImage(img: any) {
    this.acceptedArray.push(img);
    this.rejectedArray = this.validationActiveAutoSearch
      ? this.rejectedArray.filter(obj => obj.src !== img.src)
      : this.rejectedArray.filter(obj => obj.id !== img.id);
  }

  rejectImage(img: any) {
    this.rejectedArray.push(img);
    this.acceptedArray = this.validationActiveAutoSearch
      ? this.acceptedArray.filter(obj => obj.src !== img.src)
      : this.acceptedArray.filter(obj => obj.id !== img.id);
  }

  clarifaiCheck(image: any): boolean {
    let result = Math.random() < 0.75;
    this.acceptanceMap.set(image.imagePath, result);
    return result;
  }

  async uploadImage(images: ImageToValidate[]): Promise<void> {
    if (this.validationActiveAutoSearch) {
      if (this.acceptedArray.length > 0) {
        let i = 1;
        let files: File[] = [];
        for (const img of this.acceptedArray) {
          const blob = await fetch(img.src).then(res => res.blob());
          files.push(new File([blob], 'imageFound' + i + '.jpeg', blob));
          i++;
        }
        this.imageService.addImagesURLToUpload(files);
      }
    } else {
      for (const element of images) {
        let image = new AddImageData(element.category, element.description, element.imagePath, element.targetID, element.isPrivate, false);
        const patient = await this.patientService.getPatientById(this.authenticationService.getCurrentCaregiverToken()!, element.targetID);
        if (patient !== null && patient !== undefined) {
          await this.patientService.setCurrentPatient(patient);
          await this.imageService.addPatientImage(this.authenticationService.getCurrentCaregiverToken()!, this.patientService.getCurrentPatient()!.id, image);
          this.router.navigateByUrl('/caregiver/person/images');
        } else {
          await this.imageService.addCaregiverImage(this.authenticationService.getCurrentCaregiverToken()!, image);
          this.router.navigateByUrl('/caregiver/profile/images');
        }
      }
    }
  }
}