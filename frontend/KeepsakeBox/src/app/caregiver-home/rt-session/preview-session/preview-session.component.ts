import { Component, Input, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { PersonalImage } from '../../../core/models/personal-image.model';
import { RtSessionCreateData } from '../../../core/models/rt-session-create-data.model';
import { TemplateSessionData } from '../../../core/models/template-session-data.model';
import { AppContext } from '../../../core/models/app-context.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { CategoryService } from '../../../core/services/category.service';
import { DialogService } from '../../../core/services/dialog.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';

@Component({
  selector: 'app-preview-session',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './preview-session.component.html',
  styleUrls: ['./preview-session.component.css']
})
export class PreviewSessionComponent implements OnInit {

  public caregiver!: Caregiver;
  public patient!: Patient;
  public loadingImages!: boolean;
  public images!: PersonalImage[];
  public imagesCopy!: PersonalImage[];
  public loadingImage!: boolean;
  public templateSessionData!: TemplateSessionData;
  public selectedCategories!: string[];
  public selectedCategory!: string;
  @Input() selectedImages!: RtSessionCreateData[];
  @Input() imageToMoveId: string = "";
  public imageToMove!: number;
  public appContext!: AppContext;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private appService: AppService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private categoryService: CategoryService,
    private authenticationService: AuthenticationService,
    private templateSessionService: TemplateSessionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appContext = this.appService.getAppContext()!;
    this.selectedImages = this.templateSessionService.getCurrentRtSessionData()!;
    console.log("id:" + this.selectedImages[0].id + "   >> img.id:" + this.selectedImages[0].image.id);
    this.selectedCategories = this.appService.getSelectedCategories();
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.backspace', ['$event'])
  onKeydownHandler(evt: Event) {
    const keyboardEvent = evt as KeyboardEvent;

    this.imageToMove = -1;
    this.imageToMoveId = "";
  }
  
  dragImage(img: PersonalImage) {
    this.selectImageToMove(img);
  }

  dropImage(event: DragEvent, img: PersonalImage) {
    event.preventDefault();
    this.moveImageToPosition(img);
  }

  allowDropImage(event: DragEvent) {
    event.preventDefault();
  }

  async selectImage(img: PersonalImage): Promise<void> {
    if (this.imageToMoveId.length == 0) {
      this.selectImageToMove(img);
    } else if (this.imageToMoveId == img.image.id) {
      this.imageToMoveId = "";
      this.imageToMove = -1;
    } else {
      var response = await this.dialogService.askConfirmation('moveImageToNewPositionConfirmation', 'moveImageToNewPositionHelp').catch(err => false);
      if (response) {
        this.moveImageToPosition(img);
      } else {
        this.imageToMoveId = "";
        this.imageToMove = -1;
      }
    }
  }

  selectImageToMove(img: PersonalImage) {
    var idx: number = 0;
    while (idx < this.selectedImages.length && this.selectedImages[idx].id != img.image.id) {
      idx++;
    }
    if (idx == this.selectedImages.length) {
      this.imageToMove = -1;
    } else {
      this.imageToMove = idx;
      this.imageToMoveId = img.image.id;
    }
  }

  moveImageToPosition(img: PersonalImage) {
    var idx: number = 0;
    var newPosition: number = -1;
    var tmp: RtSessionCreateData;

    while (idx < this.selectedImages.length && this.selectedImages[idx].id != img.image.id) {
      idx++;
    }
    if (idx < this.selectedImages.length) {
      newPosition = idx;
      this.imageToMoveId = "";
      if (this.imageToMove < newPosition) {
        idx = this.imageToMove;
        tmp = this.selectedImages[idx];
        for (; idx < newPosition; idx++) {
          this.selectedImages[idx] = this.selectedImages[idx + 1];
        }
        this.selectedImages[idx] = tmp;
      } else if (this.imageToMove > newPosition) {
        idx = this.imageToMove;
        tmp = this.selectedImages[this.imageToMove];
        for (; idx > newPosition; idx--) {
          this.selectedImages[idx] = this.selectedImages[idx - 1];
        }
        this.selectedImages[idx] = tmp;
      }
    }
  }

  async removeImage(img: PersonalImage): Promise<void> {
    var idx: number = 0;
    while (idx < this.selectedImages.length && this.selectedImages[idx].id != img.image.id) {
      idx++;
    }
    if (idx < this.selectedImages.length) {
      var response = await this.dialogService.askConfirmation('removeImagefromListConfirmation', 'removeImagefromListHelp').catch(err => false);
      if (response) {
        for (; idx < this.selectedImages.length - 1; idx++) {
          this.selectedImages[idx] = this.selectedImages[idx + 1];
        }
        this.selectedImages.pop();
      }
    }
  }

  async backToImageSelection(): Promise<void> {
    this.router.navigate(['caregiver/session/create/sessionImages']);
  }

  async saveSession(): Promise<void> {
    var categories = this.categoryService.parseCategories(this.selectedCategories);
    var imageList: string[] = [];
    for (let i = 0; i < this.selectedImages.length; i++) {
      console.log(this.selectedImages[i].id);
      imageList.push(this.selectedImages[i].id);
    }
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    if (this.appContext.patientContext) {
      this.patient = this.patientService.getCurrentPatient()!;
      console.log("save with patient context:" + this.patient.name);
      this.templateSessionData = new TemplateSessionData("", this.caregiver.id, this.patient.id, 1, imageList.length, categories, new Date(), new Date(), imageList);
    } else {
      console.log("save without patient context.");
      this.templateSessionData = new TemplateSessionData("", this.caregiver.id, "", 1, imageList.length, categories, new Date(), new Date(), imageList);
    }
    let tsId = null;
    if (this.appContext.editing) {
      if (tsId = await this.templateSessionService.updateTemplateSession(
        this.authenticationService.getCurrentCaregiverToken()!, this.templateSessionData, this.appContext.templateSessionId)) {
        this.router.navigate([this.appContext.routingBack]);
      } else {
        this.dialogService.showErrorNotification("Ocorreu um erro!");
      }
    } else {
      if (tsId = await this.templateSessionService.createTemplateSession(
        this.authenticationService.getCurrentCaregiverToken()!, this.templateSessionData)) {
        this.router.navigate([this.appContext.routingBack]);
      } else {
        this.dialogService.showErrorNotification("Ocorreu um erro!");
      }
    }
  }

  openImageDetail(img: PersonalImage, event: Event) {
    event.stopPropagation();
    this.dialogService.imagePreview(img);
  }
}