import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PersonalImage } from '../../../core/models/personal-image.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-rt-session-preview-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './rt-session-preview-image.component.html',
  styleUrls: ['./rt-session-preview-image.component.css']
})
export class RtSessionPreviewImageComponent {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  @Input() img!: PersonalImage;

  constructor(
    private categoryService: CategoryService,
    private activeModal: NgbActiveModal
  ) {}

  translateLabels(categories: string): string {
    console.log("enter in translateLabels: " + categories);
    return this.categoryService.categoriesTranslation(categories, this.translateCache);
  }

  closeWindow(): void {
    this.activeModal.close(true);
  }
}