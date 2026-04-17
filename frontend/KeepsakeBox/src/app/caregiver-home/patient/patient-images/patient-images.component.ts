import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { PersonalImage } from '../../../core/models/personal-image.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { ImageService } from '../../../core/services/image.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { CategoryService } from '../../../core/services/category.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-images',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPagination, RouterLink],
  templateUrl: './patient-images.component.html',
  styleUrls: ['./patient-images.component.css']
})
export class PatientImagesComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public hideOptions!: boolean;
  public hideFilter!: boolean;
  @Input() page = 1;
  @Input() pageSize = 5;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public loadingImage!: boolean;
  public loadingFolder!: boolean;
  public categories: string[] = [];
  public selectedCategories: string[] = [];
  public onlyFavorites!: boolean;
  public caregiver!: Caregiver;
  public patient!: Patient;
  public loadingImages!: boolean;
  public images: PersonalImage[] = [];
  public imagesCopy: PersonalImage[] = [];
  public imagesByCategory: PersonalImage[] = [];
  public imagesByFavorite: PersonalImage[] = [];
  public thumbnails!: PersonalImage[];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private patientService: PatientService
  ) {}

  async ngOnInit(): Promise<void> {
    this.showOptions();
    this.loadingImage = false;
    this.loadingFolder = false;
    this.categories = await this.categoryService.getCategories();
    this.selectedCategories = [];
    this.onlyFavorites = false;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    this.retrievePatientPersonalImages();
  }

  translateLabels(categories: string): string {
    return this.categoryService.categoriesTranslation(categories, this.translateCache);
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  showOptions(): void {
    this.hideOptions = false;
    this.hideFilter = true;
  }

  showFilter(): void {
    this.hideOptions = true;
    this.hideFilter = false;
  }

  async getThumbnailPath(imageId: string): Promise<string> {
    let thumbnail = await this.imageService.getThumbnail(imageId);
    return thumbnail!.imagePath;
  }

  async retrievePatientPersonalImages(): Promise<void> {
    this.loadingImages = true;
    this.images = await this.imageService.getPatientImages(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.patientService.getCurrentPatient()!.id
    );
    this.imagesCopy = this.images;
    this.imagesByCategory = this.images;
    this.imagesByFavorite = this.images.filter(img => img.isFavorite);
    this.collectionSize = this.images.length;
    this.loadingImages = false;
  }

  categoryClick(category: string): void {
    if (this.selectedCategories.includes(category)) {
      let index = this.selectedCategories.indexOf(category);
      if (index > -1) this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  favoriteClick(): void {
    this.onlyFavorites = !this.onlyFavorites;
    this.searchImageByCategory();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  resetSelectedCategories(): void {
    this.selectedCategories = [];
  }

  async searchImageByCategory(): Promise<void> {
    if (this.selectedCategories.length > 0) {
      this.images = [];
      for (let cat of this.selectedCategories) {
        let tempImages: PersonalImage[] = [];
        if (this.onlyFavorites) {
          tempImages = this.imagesByFavorite.filter(img => img.image.category.toLowerCase().includes(cat.toLowerCase()));
        } else {
          tempImages = this.imagesCopy.filter(img => img.image.category.toLowerCase().includes(cat.toLowerCase()));
        }
        for (let tempImg of tempImages) {
          if (!this.images.includes(tempImg)) {
            this.images.push(tempImg);
          }
        }
      }
      this.images = this.images.sort((a, b) => (a.image.lastUpdatedDate! < b.image.lastUpdatedDate!) ? 1 : -1);
    } else {
      this.images = this.onlyFavorites ? this.imagesByFavorite : this.imagesCopy;
    }
    this.imagesByCategory = this.images;
    this.collectionSize = this.images.length;
  }

  searchImageByDescription(event: Event): void {
    this.images = this.imagesByCategory;
    const filterValue = (event.target as HTMLInputElement).value;
    this.images = this.images.filter(img =>
      img.image.description.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.collectionSize = this.images.length;
  }

  async goToImageDetails(image: PersonalImage): Promise<void> {
    this.router.navigateByUrl('/caregiver/person/image', {
      state: { image: image }
    });
  }

  async addImages(event: any): Promise<void> {
    this.loadingImage = true;
    if (event.target.files && event.target.files[0]) {
      this.imageService.addImagesURLToUpload(event.target.files);
    }
  }

  async addImagesFolder(event: any): Promise<void> {
    this.loadingFolder = true;
    if (event.target.files && event.target.files[0]) {
      let files: any[] = await Array.from(event.target.files).filter(function (f: any) {
        return f['type'].includes("image");
      });
      this.imageService.addImagesURLToUpload(files);
    }
  }
}