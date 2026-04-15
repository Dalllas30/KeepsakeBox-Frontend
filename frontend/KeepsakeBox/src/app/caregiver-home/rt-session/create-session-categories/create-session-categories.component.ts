import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { ImageService } from '../../../core/services/image.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { AppService } from '../../../core/services/app.service';
import { CategoryService } from '../../../core/services/category.service';
import { DialogService } from '../../../core/services/dialog.service';
import { AppContext } from '../../../core/models/app-context.model';

@Component({
  selector: 'app-create-session-categories',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './create-session-categories.component.html',
  styleUrls: ['./create-session-categories.component.css']
})
export class CreateSessionCategoriesComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public appContext!: AppContext;
  @Input() categories: string[] = [];
  @Input() selectedCategories: string[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService,
    private templateSessionService: TemplateSessionService,
    private appService: AppService,
    private dialogService: DialogService
  ) {}

  async ngOnInit(): Promise<void> {
    this.appContext = this.appService.getAppContext()!;
    this.categories = await this.categoryService.getCategories();
    this.selectedCategories = this.appService.getSelectedCategories();
  }

  categoryClick(category: string): void {
    if (this.selectedCategories.includes(category)) {
      let index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    } else {
      this.selectedCategories.push(category);
    }
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  categoryImagesNumber(category: string): number {
    return this.categoryService.categoryImagesNumber(category);
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  goToNextStep(): void {
    this.appService.resetSelectedCategories();
    this.appService.setSelectedCategories(this.selectedCategories);
    this.templateSessionService.resetCurrentRtSessionData();
    this.templateSessionService.setCurrentRtSessionData([]);
    this.router.navigate(['/caregiver/session/create/sessionImages']);
  }

  async backToStartList(): Promise<void> {
    var response = await this.dialogService.askConfirmation('backToStartListConfirmation', 'backToStartListHelp')
      .catch(err => false);
    if (response) {
      this.router.navigate([this.appContext.routingBack]);
    }
  }

  async generateImagesAuto(): Promise<void> {
    this.appService.resetSelectedCategories();
    this.appService.setSelectedCategories(this.selectedCategories);
    this.router.navigate(['/caregiver/session/create/sessionAutomatic']);
  }

  size(st: string[]): number {
    if (st == null) {
      return 0;
    } else {
      return st.length;
    }
  }
}