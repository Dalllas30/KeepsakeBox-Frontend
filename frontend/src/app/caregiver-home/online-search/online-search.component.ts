/**
 * @author André Santana - fc49451
 */


import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../core/services/app.service';
import { ImageService } from '../../core/services/image.service';
import { OnlineSearchService } from '../../core/services/online-search.service';
import { FormObject, FoundImage } from '../../core/models/image.model';

@Component({
  selector: 'app-online-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './online-search.component.html',
  styleUrl: './online-search.component.css'
})
export class OnlineSearchComponent implements OnInit {
  private router       = inject(Router);
  private appService   = inject(AppService);
  private imageService = inject(ImageService);
  private onlineSearchService = inject(OnlineSearchService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  findingImages      = false;
  categoryTextInput  = '';
  chosenCategories:  string[] = [];
  alertCategoryInput = false;
  categories:        string[] = [];
  categoriesCopy:    string[] = [];
  foundImages:       FoundImage[] = [];

  ngOnInit(): void {
    this.categories     = this.translateCache === 'pt'
      ? this.imageService.getCategoriesPT()
      : this.imageService.getCategoriesENG();
    this.categoriesCopy = [...this.categories];
  }

  onEnterCatTextInput(): void {
    if (this.categoryTextInput) {
      const added = this.addToChosenCategories(this.categoryTextInput);
      this.alertCategoryInput = !added;
      if (added) this.categoryTextInput = '';
    }
  }

  addToChosenCategories(category: string): boolean {
    if (!this.chosenCategories.includes(category)) {
      this.chosenCategories.push(category);
      return true;
    }
    return false;
  }

  removeFromChosenCategories(category: string): void {
    this.chosenCategories = this.chosenCategories.filter(e => e !== category);
    if (this.categories.includes(category)) this.categoriesCopy.push(category);
  }

  resetChosenCategories(): void {
    this.chosenCategories.forEach(c => {
      if (this.categories.includes(c)) this.categoriesCopy.push(c);
    });
    this.chosenCategories = [];
  }

  categoryClick(category: string): void {
    this.addToChosenCategories(category);
    this.categoriesCopy = this.categoriesCopy.filter(e => e !== category);
  }

  confirmSearch(): void {
    this.findingImages = true;
    const tagsString = this.chosenCategories.join(',');
    const numberOfImages = Number.parseInt(
      (document.getElementById('numberOfImagesToSearch') as HTMLInputElement).value
    );

    const formObject: FormObject = {
      tags:     tagsString,
      tag_mode: 'any',
      text:     '',
      sort:     6,
      per_page: numberOfImages,
      page:     1,
    };

    this.onlineSearchService.getPhotos(formObject).subscribe(res => {
      this.foundImages = res;
      this.findingImages = false;
      this.navigateToCaregiverValidation();
    });
  }

  navigateToCaregiverValidation(): void {
    this.router.navigate(['/caregiver/profile/validation/images'], {
      state: { photos: this.foundImages, validationActive: true }
    });
  }

  isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }
}