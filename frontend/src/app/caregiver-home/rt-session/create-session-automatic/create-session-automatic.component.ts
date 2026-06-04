import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ImageService } from '../../../core/services/image.service';
import { AppService } from '../../../core/services/app.service';
import { DialogService } from '../../../core/services/dialog.service';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { CategoryService } from '../../../core/services/category.service';
import { AppContext } from '../../../core/models/app-context.model';
import { RtSessionCreateData } from '../../../core/models/rt-session-create-data.model';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { TemplateSessionData } from '../../../core/models/template-session-data.model';

@Component({
  selector: 'app-create-session-automatic',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './create-session-automatic.component.html',
  styleUrls: ['./create-session-automatic.component.css']
})
export class CreateSessionAutomaticComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public caregiver!: Caregiver;
  public patient!: Patient;
  public appContext!: AppContext;
  public selectedCategories!: string[];
  public selectedImages!: RtSessionCreateData[];
  public templateSessionData!: TemplateSessionData;
  public totalImagesNumber: number = 1;
  public maxtotalImagesNumber: number = 20;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialogService: DialogService,
    private templateSessionService: TemplateSessionService,
    private imageService: ImageService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.appContext = this.appService.getAppContext()!;
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    this.selectedCategories = this.appService.getSelectedCategories();
    this.cdr.detectChanges();
  }

  translateLabel(category: string): string {
    return this.categoryService.categoryTranslation(category, this.translateCache);
  }

  categoryImagesNumber(category: string): number {
    return this.categoryService.categoryImagesNumber(category);
  }

  async backToCategoryList(): Promise<void> {
    var response = await this.dialogService.askConfirmation('backToCategoryListConfirmation', 'backToCategoryListHelp')
      .catch(err => false);
    if (response) {
      this.router.navigate(['/caregiver/session/create/sessionCategories']);
    }
  }

  async formGoToNextStep(event: Event): Promise<void> {
    var categories = this.categoryService.parseCategories(this.selectedCategories);
    var tot = 0;
    var qt = (event.target as HTMLFormElement)['quantity'];
    var total_qt = (event.target as HTMLFormElement)['total_quantity'];
    let categoryList: string[] = [];

    if (this.selectedCategories.length > 0) {
      console.log("ramdom images with categories: " + qt.id);
      if (qt.id) {
        categoryList.push(qt.id + ":" + qt.value);
      } else {
        for (var i = 0; i < qt.length; i++) {
          tot = tot + qt[i].valueAsNumber;
        }
        for (var i = 0; i < qt.length; i++) {
          categoryList.push(qt[i].id + ":" + qt[i].value);
        }
      }
    } else {
      console.log("ramdom images without categories: " + total_qt.id);
      categoryList.push("Férias" + ":" + total_qt.value);
      categories = "Férias";
      this.selectedCategories.push("Férias");
      this.appService.resetSelectedCategories();
      this.appService.setSelectedCategories(this.selectedCategories);
    }
    console.log("will generate images");

    const isIndependent = this.authenticationService.getCurrentUserRole() === 'independent';
    const independentUserId = localStorage.getItem('currentIndependentUserId') ?? undefined;
    if (isIndependent) {
      this.templateSessionData = new TemplateSessionData("", "", "", 2, categoryList.length, categories, new Date(), new Date(), categoryList, independentUserId);
    } else if (this.patient) {
      this.templateSessionData = new TemplateSessionData("", this.caregiver.id, this.patient.id, 2, categoryList.length, categories, new Date(), new Date(), categoryList);
      console.log("with patient");
    } else {
      this.templateSessionData = new TemplateSessionData("", this.caregiver.id, "", 2, categoryList.length, categories, new Date(), new Date(), categoryList);
      console.log("without patient");
    }

    if (this.selectedImages = await this.templateSessionService.selectImageList4TemplateSession(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.templateSessionData)) {
      this.templateSessionService.resetCurrentRtSessionData();
      this.templateSessionService.setCurrentRtSessionData(this.selectedImages);
      console.log(this.selectedImages);
      this.router.navigate(['/caregiver/session/preview']);
    } else {
      this.dialogService.showErrorNotification("Ocorreu um erro!");
    }
  }

  increaseTotalImages(): void {
    var quantity = (<HTMLInputElement>document.getElementById('total_quantity'));
    if (quantity.valueAsNumber < this.maxtotalImagesNumber) {
      quantity.valueAsNumber = quantity.valueAsNumber + 1;
    }
  }

  decreaseTotalImages(): void {
    var quantity = (<HTMLInputElement>document.getElementById('total_quantity'));
    if (quantity.valueAsNumber > 1) {
      quantity.valueAsNumber = quantity.valueAsNumber - 1;
    }
  }

  increaseImagesNumber(category: string): void {
    var quantity = (<HTMLInputElement>document.getElementById(category));
    if (quantity.valueAsNumber < this.categoryImagesNumber(category)) {
      quantity.valueAsNumber = quantity.valueAsNumber + 1;
    }
  }

  decreaseImagesNumber(category: string): void {
    var quantity = (<HTMLInputElement>document.getElementById(category));
    if (quantity.valueAsNumber > 0) {
      quantity.valueAsNumber = quantity.valueAsNumber - 1;
    }
  }
}