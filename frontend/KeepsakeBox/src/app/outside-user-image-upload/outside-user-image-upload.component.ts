import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';

import { Caregiver } from '../core/models/caregiver.model';
import { ImageToValidateData, Request } from '../core/models/image.model';
import { AppService } from '../core/services/app.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { CaregiverService } from '../core/services/caregiver.service';
import { CategoryService } from '../core/services/category.service';
import { ImageService } from '../core/services/image.service';
import { PatientService } from '../core/services/patient.service';
import { ValidationService } from '../core/services/validation.service';
import { CancelScreenComponent } from '../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-outside-user-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CancelScreenComponent],
  templateUrl: './outside-user-image-upload.component.html',
  styleUrls: ['./outside-user-image-upload.component.css']
})
export class OutsideUserImageUploadComponent implements OnInit {

  @Input() request!: Request;
  public target: any;
  public files: any[] = [];
  public fileCount: number = 0;
  public loadingImage!: boolean;
  public loadingFolder!: boolean;
  public submetido: boolean = false;
  public nameInput!: boolean;
  public submissionAttempted: boolean = false;
  public imagesAmountToValidate!: number;
  public addingImage!: boolean;
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public hideCancel!: boolean;
  public hideDiscardImage!: boolean;
  public hideAddImage1!: boolean;
  public hideAddImage2!: boolean;
  public imageCounter!: number;
  public imagesAmount!: number;
  public caregiver!: Caregiver;
  public currentImage!: ImageToValidateData;
  public categories!: string[];
  public selectedCategories: string[] = [];
  public uploadingImage: boolean = false;
  public imageAdded: boolean = false;
  public imageDiscarded: boolean = false;
  public added: boolean = true;
  public imagesToValidate: ImageToValidateData[] = [];

  constructor(
    private imageService: ImageService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private categoryService: CategoryService,
    private appService: AppService,
    private validationService: ValidationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.fileCount = 0;
    this.submetido = false;
    this.submissionAttempted = false;
    if (this.request.targetID !== this.request.caregiverID) {
      this.defineTargetPatient(this.request.targetID);
    } else {
      this.defineTargetCaregiver(this.request.caregiverID);
    }
    this.cdr.detectChanges();
    this.imagesToValidate = [];
    this.showAddImage1();
    this.imageCounter = 1;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.categories = await this.categoryService.getCategories();
    this.selectedCategories = [];
    this.uploadingImage = false;
    this.imageAdded = false;
    this.imageDiscarded = false;
    this.added = true;
  }

  async defineTargetCaregiver(id: string) {
    this.target = await this.caregiverService.getCaregiverOutsideById(id);
  }

  async defineTargetPatient(id: string) {
    this.target = await this.patientService.getPatientById(
      this.authenticationService.getCurrentCaregiverToken()!, id);
  }

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
    this.fileCount++;
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) return;
      const progressInterval = setInterval(() => {
        if (this.files[index].progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        } else {
          this.files[index].progress += 5;
        }
      }, 200);
    }, 1000);
  }

  async addImages(event: any): Promise<void> {
    this.loadingImage = true;
    this.hideAddImage1 = false;
    if (event.target.files && event.target.files[0]) {
      this.imageService.addImagesURLToUploadForValidation(event.target.files, this.request).then(() => {
        this.currentImage = new ImageToValidateData(
          this.request.caregiverID, this.request.targetID, "", "",
          this.imageService.popImageToValidateURL(), "", "", false);
        this.addingImage = true;
        this.imagesAmount = event.target.files.length;
      });
    }
  }

  formatBytes(bytes: number, decimals: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  submeter() {
    this.submissionAttempted = true;
    const textInput: string = (<HTMLInputElement>document.getElementById("textInputField")).value;
    this.nameInput = textInput.length > 0;
    this.submetido = this.nameInput && this.fileCount > 0;
    if (this.submetido) {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      const generatedDate = this.formatDate(date);
      const uuid = uuidv4();
      this.imagesToValidate.forEach(imageData => {
        imageData.username = textInput + "/" + uuid;
        imageData.submissionDate = generatedDate;
        this.validationService.sendImageToValidate(imageData);
      });
    }
  }

  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  goBack() {
    this.submetido = false;
  }

  getBase64Image(img: any) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  showCancel() {
    this.hideCancel = false;
    this.hideDiscardImage = true;
    this.hideAddImage1 = true;
    this.hideAddImage2 = true;
  }

  showDiscardImage() {
    this.hideCancel = true;
    this.hideDiscardImage = false;
    this.hideAddImage1 = true;
    this.hideAddImage2 = true;
  }

  showAddImage1() {
    this.hideCancel = true;
    this.hideDiscardImage = true;
    this.hideAddImage1 = false;
    this.hideAddImage2 = true;
  }

  showAddImage2() {
    this.hideCancel = true;
    this.hideDiscardImage = true;
    this.hideAddImage1 = true;
    this.hideAddImage2 = false;
  }

  navigateToSubmissionPage() {
    this.addingImage = false;
    this.hideCancel = true;
    this.hideDiscardImage = true;
    this.hideAddImage1 = true;
    this.hideAddImage2 = true;
    this.imageCounter = 1;
    this.selectedCategories = [];
  }

  skipImage() {
    this.imageAdded = false;
    this.imageDiscarded = true;
    this.imageCounter = this.imageCounter + 1;
    if (this.imageCounter > this.imagesAmount) {
      this.navigateToSubmissionPage();
    } else {
      this.selectedCategories = [];
      this.currentImage = new ImageToValidateData(
        this.request.caregiverID, this.request.targetID, "", "",
        this.imageService.popImageToValidateURL(), "", "", false);
      this.showAddImage1();
    }
  }

  categoryClick(category: string): void {
    this.imageAdded = false;
    this.imageDiscarded = false;
    if (this.selectedCategories.includes(category)) {
      let index = this.selectedCategories.indexOf(category);
      if (index > -1) this.selectedCategories.splice(index, 1);
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

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  async uploadImageToValidate() {
    this.imageAdded = false;
    this.imageDiscarded = false;
    this.uploadingImage = true;
    this.currentImage.category = this.categoryService.parseCategories(this.selectedCategories);
    this.imagesToValidate.push(this.currentImage);
    this.uploadingImage = false;
    if (this.imageCounter == this.imagesAmount) {
      this.navigateToSubmissionPage();
    } else {
      this.imageCounter = this.imageCounter + 1;
      this.selectedCategories = [];
      this.showAddImage1();
      this.currentImage = new ImageToValidateData(
        this.request.caregiverID, this.request.targetID, "", "",
        this.imageService.popImageToValidateURL(), "", "", false);
      this.imageAdded = true;
    }
  }
}