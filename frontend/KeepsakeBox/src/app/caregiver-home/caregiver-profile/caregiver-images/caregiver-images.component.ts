import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { PersonalImage } from '../../../core/models/personal-image.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { ImageService } from '../../../core/services/image.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-caregiver-images',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, RouterLink],
  templateUrl: './caregiver-images.component.html',
  styleUrls: ['./caregiver-images.component.css']
})
export class CaregiverImagesComponent implements OnInit {
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public hideOptions: boolean = false;
  public hideFilter: boolean = true;
  @Input() page = 1;
  @Input() pageSize = 5;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public loadingImage: boolean = false;
  public loadingFolder: boolean = false;
  public categories: string[] = [];
  public selectedCategories: string[] = [];
  public onlyFavorites: boolean = false;
  public caregiver!: Caregiver;
  public loadingImages: boolean = false;
  public images: PersonalImage[] = [];
  public thumbnails: PersonalImage[] = [];
  public imagesCopy: PersonalImage[] = [];
  public imagesByCategory: PersonalImage[] = [];
  public imagesByFavorite: PersonalImage[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.retrieveCaregiverPersonalImages();  }

  translateLabels(categories: string): string {
    return this.categoryService.categoriesTranslation(categories, this.translateCache);
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  showOptions(): void { this.hideOptions = false; this.hideFilter = true; }
  showFilter(): void { this.hideOptions = true; this.hideFilter = false; }

  async retrieveCaregiverPersonalImages(): Promise<void> {
    this.loadingImages = true;
    const isIndependent = this.authenticationService.getCurrentUserRole() === 'independent';
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    this.images = isIndependent
      ? await this.imageService.getIndependentImages(token)
      : await this.imageService.getCaregiverImages(token);
    this.imagesCopy = this.images;
    this.imagesByCategory = this.images;
    this.imagesByFavorite = this.images.filter(img => img.isFavorite);
    this.collectionSize = this.images.length;
    this.loadingImages = false;
    this.cdr.detectChanges();
  }

  categoryClick(category: string): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1);
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

  resetSelectedCategories(): void { this.selectedCategories = []; }

  async searchImageByCategory(): Promise<void> {
    if (this.selectedCategories.length > 0) {
      this.images = [];
      for (let cat of this.selectedCategories) {
        let source = this.onlyFavorites ? this.imagesByFavorite : this.imagesCopy;
        let tempImages = source.filter(img => img.image.category.toLowerCase().includes(cat.toLowerCase()));
        for (let tempImg of tempImages) {
          if (!this.images.includes(tempImg)) this.images.push(tempImg);
        }
      }
      this.images = this.images.sort((a, b) => (a.image.lastUpdatedDate?.getTime() ?? 0) < (b.image.lastUpdatedDate?.getTime() ?? 0) ? 1 : -1);
    } else {
      this.images = this.onlyFavorites ? this.imagesByFavorite : this.imagesCopy;
    }
    this.imagesByCategory = this.images;
    this.collectionSize = this.images.length;
  }

  searchImageByDescription(event: Event): void {
    this.images = this.imagesByCategory;
    const filterValue = (event.target as HTMLInputElement).value;
    this.images = this.images.filter(img => img.image.description.toLowerCase().includes(filterValue.toLowerCase()));
    this.collectionSize = this.images.length;
  }

  async goToImageDetails(image: PersonalImage): Promise<void> {
    this.router.navigateByUrl('/caregiver/profile/image', { state: { image: image } });
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
      let files: any[] = await Array.from(event.target.files).filter((f: any) => f['type'].includes("image"));
      this.imageService.addImagesURLToUpload(files);
    }
  }
}