import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AppService } from '../../../core/services/app.service';
import { DialogService } from '../../../core/services/dialog.service';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { PersonalImage } from '../../../core/models/personal-image.model';
import { PatientService } from '../../../core/services/patient.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { ImagesFilterData } from '../../../core/models/images-filter-data.model';
import { RtSessionCreateData } from '../../../core/models/rt-session-create-data.model';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { CategoryService } from '../../../core/services/category.service';
import { AppContext } from '../../../core/models/app-context.model';
import { ImageService } from '../../../core/services/image.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-create-session-images',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPaginationModule],
  templateUrl: './create-session-images.component.html',
  styleUrls: ['./create-session-images.component.css']
})
export class CreateSessionImagesComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public caregiver!: Caregiver;
  public patient!: Patient;
  public loadingImages!: boolean;
  public images!: PersonalImage[];
  public imagesFilterData!: ImagesFilterData;
  public imagesCopy!: PersonalImage[];
  public loadingImage!: boolean;
  public selectedCategories!: string[];
  public selectedImagesByCategory: any;
  public selectedCategory!: string;
  public imageDescription: string = "";
  @Input() selectedImages!: RtSessionCreateData[];
  @Input() AllPublicImage: boolean = true;
  @Input() MyImageAll: boolean = true;
  @Input() MyImagePrivate: boolean = false;
  @Input() MyImageFavorite: boolean = false;
  @Input() PatientImageAll: boolean = true;
  @Input() PatientImagePrivate: boolean = false;
  @Input() PatientImageFavorite: boolean = false;
  public ImageDescription2search: string = "";
  public appContext!: AppContext;
  @Input() showPatientFilter!: boolean;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() maxSize = 5;
  public collectionSize: number = 0;
  public totalListSize: number = 0;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialogService: DialogService,
    private imageService: ImageService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private templateSessionService: TemplateSessionService,
    private appService: AppService,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.appContext = this.appService.getAppContext()!;
    this.showPatientFilter = this.appContext.patientContext;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    this.selectedCategories = this.appService.getSelectedCategories();
    this.selectedCategory = this.selectedCategories[0];
    this.loadingImage = false;
    this.retrieveImagesByCategory(this.selectedCategory);
    this.selectedImages = this.templateSessionService.getCurrentRtSessionData()!;
    this.selectedImagesByCategory = new Map();
    this.selectedCategories.forEach(category => {
      this.selectedImagesByCategory.set(category, 0);
    });
    this.selectedImages.forEach(img => {
      img.image.category.split(',').forEach(c => {
        let category = c.trim();
        if (this.selectedImagesByCategory.has(category)) {
          this.selectedImagesByCategory.set(category, this.selectedImagesByCategory.get(category) + 1);
        }
      });
    });
  }

  isCategoryActive(category: string): boolean {
    return this.selectedCategory == category;
  }

  selectCategory(category: string) {
    if (this.selectedCategory != category) {
      this.selectedCategory = category;
      this.retrieveImagesByCategory(this.selectedCategory);
    }
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  async retrieveImagesByCategory(category: string): Promise<void> {
    var patientId: string;
    this.loadingImages = true;

    if (this.appContext.patientContext) {
      patientId = this.patient.id;
    } else {
      patientId = "any";
    }

    if (this.imagesFilterData) {
      this.imagesFilterData.caregiverId = this.caregiver.id;
      this.imagesFilterData.patientId = patientId;
      this.imagesFilterData.category = category;
      this.imagesFilterData.allPublicImage = this.AllPublicImage;
      this.imagesFilterData.myImageAll = this.MyImageAll;
      this.imagesFilterData.myImagePrivate = this.MyImagePrivate;
      this.imagesFilterData.myImageFavorite = this.MyImageFavorite;
      this.imagesFilterData.patientImageAll = this.PatientImageAll;
      this.imagesFilterData.patientImagePrivate = this.PatientImagePrivate;
      this.imagesFilterData.patientImageFavorite = this.PatientImageFavorite;
      this.imagesFilterData.description = this.imageDescription;
      this.imagesFilterData.pageSize = this.pageSize;
      this.imagesFilterData.maxSize = this.maxSize;
      this.imagesFilterData.page = this.page;
      this.imagesFilterData.countedImages = this.totalListSize;
    } else {
      this.imagesFilterData = new ImagesFilterData(
        this.caregiver.id, patientId, category,
        this.AllPublicImage, this.MyImageAll, this.MyImagePrivate, this.MyImageFavorite,
        this.PatientImageAll, this.PatientImagePrivate, this.PatientImageFavorite,
        this.imageDescription, this.pageSize, this.maxSize, this.page, this.totalListSize
      );
    }

    console.log(this.imagesFilterData);
    this.images = await this.imageService.getImagesByCategory(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.imagesFilterData
    );
    this.imagesCopy = this.images;
    this.loadingImages = false;
    this.collectionSize = this.images.length;
    this.cdr.detectChanges();
  }

  formGoToNextStep() {
    // there's a bug here!!
  }

  goToNextStep() {
    this.templateSessionService.resetCurrentRtSessionData();
    this.templateSessionService.setCurrentRtSessionData(this.selectedImages);
    this.router.navigate(['/caregiver/session/preview']);
  }

  imagesSize(lst: PersonalImage[]): number {
    if (this.loadingImages) return -1;
    else if (lst == null) return 0;
    else return lst.length;
  }

  selectedImagesSize(lst: RtSessionCreateData[]): number {
    if (lst == null) return 0;
    else return lst.length;
  }

  isImageSelected(imageId: string): Boolean {
    if (this.selectedImages == null || this.selectedImages.length == 0) return false;
    return this.selectedImages.findIndex(r => r.id == imageId) !== -1;
  }

  private getImageId(img: PersonalImage): string {
    return ((img as any).id ?? img.image?.id ?? '').toString();
  }

  selectImage(img: PersonalImage) {
    const imageId = this.getImageId(img);
    if (!imageId) {
      return;
    }

    var idx = this.selectedImages.findIndex(r => r.id == imageId);
    if (idx == -1) {
      this.selectedImages.push(new RtSessionCreateData(
        imageId,
        { ...(img.image as any), id: imageId },
        false,
        img.isFavorite
      ));
      img.image.category.split(',').forEach(c => {
        let category = c.trim();
        if (this.selectedImagesByCategory.has(category)) {
          this.selectedImagesByCategory.set(category, this.selectedImagesByCategory.get(category) + 1);
        }
      });
    } else {
      this.selectedImages.splice(idx, 1);
      img.image.category.split(',').forEach(c => {
        let category = c.trim();
        if (this.selectedImagesByCategory.has(category)) {
          this.selectedImagesByCategory.set(category, this.selectedImagesByCategory.get(category) - 1);
        }
      });
    }
  }

  openImageDetail(img: PersonalImage, event: Event) {
    event.stopPropagation();
    this.dialogService.imagePreview(img);
  }

  async backToCategories(): Promise<void> {
    var response = await this.dialogService.askConfirmation('backToCategoryListConfirmation', 'backToCategoryListHelp')
      .catch(err => false);
    if (response) {
      this.router.navigate(['/caregiver/session/create/sessionCategories']);
    }
  }

  async setFilters(): Promise<void> {
    if (this.AllPublicImage != this.imagesFilterData.allPublicImage ||
      this.MyImageAll != this.imagesFilterData.myImageAll ||
      this.MyImagePrivate != this.imagesFilterData.myImagePrivate ||
      this.MyImageFavorite != this.imagesFilterData.myImageFavorite ||
      this.PatientImageAll != this.imagesFilterData.patientImageAll ||
      this.PatientImagePrivate != this.imagesFilterData.patientImagePrivate ||
      this.PatientImageFavorite != this.imagesFilterData.patientImageFavorite) {
      this.loadingImage = false;
      this.page = 1;
      this.totalListSize = 0;
      await this.retrieveImagesByCategory(this.selectedCategory);
      this.selectedImages = this.templateSessionService.getCurrentRtSessionData()!;
    }
  }

  async searchImageByDescription(event: Event, val: string): Promise<void> {
    var imgDescription2search = (event.target as HTMLInputElement).value;
    this.imageDescription = imgDescription2search;
    setTimeout(async () => { await this.searchImageWithDescription(); }, 1000);
  }

  async searchImageWithDescription(): Promise<void> {
    if (this.loadingImages) {
      setTimeout(async () => { await this.searchImageWithDescription(); }, 1000);
    } else if (this.imageDescription != this.ImageDescription2search) {
      this.ImageDescription2search = this.imageDescription;
      console.log("=> efective search for: " + this.imageDescription);
      this.loadingImage = false;
      this.page = 1;
      this.totalListSize = 0;
      await this.retrieveImagesByCategory(this.selectedCategory);
      this.selectedImages = this.templateSessionService.getCurrentRtSessionData()!;
    }
  }

  async setPage(page: number): Promise<void> {
    this.page = page;
  }

  async loadPage(page: number): Promise<void> {
    this.page = page;
    await this.retrieveImagesByCategory(this.selectedCategory);
  }
}