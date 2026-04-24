import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { CategoryService } from '../../../core/services/category.service';
import { Caregiver } from '../../../core/models/caregiver.model';
import { ProfileImage } from '../../../core/models/profile-image.model';
import { BirthDate } from '../../../core/models/birth-date.model';
import { CaregiverPatientRegisterData } from '../../../core/models/caregiver-patient-register-data.model';
import { PatientRegisterData } from '../../../core/models/patient-register-data.model';
import { CancelScreenComponent } from '../../../shared/cancel-screen/cancel-screen.component';
import { ProfileImageComponent } from '../../../shared/profile-image/profile-image.component';
import { BirthDateInputComponent } from '../../../shared/birth-date-input/birth-date-input.component';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule,
            CancelScreenComponent, ProfileImageComponent, BirthDateInputComponent],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private categoryService       = inject(CategoryService);
  private cdr                   = inject(ChangeDetectorRef);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  relationsPT = [
    "Esposa/Esposo","Mãe/Pai","Avó/Avô","Irmã/Irmão","Namorada/Namorado","Tia/Tio",
    "Prima/Primo","Filha/Filho","Sobrinha/Sobrinho","Neta/Neto","Familiar","Amiga/Amigo"
  ];
  relationsENG = [
    "Spouse","Mother/Father","Grandmother/Grandfather","Sister/Brother","Boyfriend/Girlfriend","Aunt/Uncle",
    "Cousin","Daughter/Son","Niece/Nephew","Granddaughter/Grandson","Relative","Friend"
  ];
  educationsPT = [
    "Ensino Primário / 1º Ciclo do Ensino Básico",
    "Ciclo Preparatório / 2º Ciclo do Ensino Básico",
    "Ensino Secundário Geral / 3º Ciclo do Ensino Básico",
    "Ensino Secundário Complementar / Ensino Secundário",
    "Ensino Superior"
  ];
  educationsENG = [
    "Primary School / Elementary School",
    "Preparatory Cicle / 2nd Cycle of Basic Education",
    "General Secondary Education / 3rd Cycle of Basic Education",
    "Complementary High School / Secondary Education",
    "Higher Education"
  ];

  hideCancel      = true;
  hideAddPatient  = false;
  advance         = false;

  added           = true;
  addingPatient   = false;

  caregiver!: Caregiver;
  profileImage!: ProfileImage;
  birthDate!: BirthDate;
  caregiverPatientRegisterData!: CaregiverPatientRegisterData;

  categories:       string[] = [];
  categoriesCopy:   string[] = [];
  chosenCategories: string[] = [];
  chosenInterests:  string[] = [];
  selectedInterests: string[] = [];

  categoryTextInput  = '';
  interestTextInput  = '';
  alertCategoryInput = false;
  alertInterestInput = false;

  async ngOnInit(): Promise<void> {
    this.caregiverPatientRegisterData = new CaregiverPatientRegisterData(
      new PatientRegisterData("", "", null, "", "", "", ""), ""
    );
    this.caregiver   = this.caregiverService.getCurrentCaregiver()!;
    this.profileImage = new ProfileImage("");
    this.birthDate    = new BirthDate(0, -1, 0, true);
    this.categories   = await this.categoryService.getCategories();
    this.categoriesCopy = [...this.categories];
    this.cdr.detectChanges();
  }

  showCancel():      void { this.hideCancel = false; this.hideAddPatient = true; }
  showAddPatient():  void { this.hideCancel = true;  this.hideAddPatient = false; }
  goAdvance():       void { this.advance = true; }
  goBackAdvance():   void { this.advance = false; }

  navigateToPatientList(): void {
    this.router.navigate(['caregiver/persons']);
  }

  addToChosenCategories(category: string): boolean {
    if (!this.chosenCategories.includes(category)) {
      this.chosenCategories.push(category);
      return true;
    }
    return false;
  }

  addToChosenInterests(category: string): boolean {
    if (!this.chosenInterests.includes(category)) {
      this.chosenInterests.push(category);
      return true;
    }
    return false;
  }

  interestClick(category: string): void {
    this.addToChosenInterests(category);
    this.categoriesCopy = this.categoriesCopy.filter(e => e !== category);
    if (this.selectedInterests.includes(category)) {
      this.selectedInterests.splice(this.selectedInterests.indexOf(category), 1);
    } else {
      this.selectedInterests.push(category);
    }
  }

  onEnterCatTextInput(): void {
    if (this.categoryTextInput) {
      const added = this.addToChosenCategories(this.categoryTextInput);
      this.alertCategoryInput = !added;
      if (added) this.categoryTextInput = '';
    }
  }

  onEnterInterestTextInput(): void {
    if (this.interestTextInput) {
      const added = this.addToChosenInterests(this.interestTextInput);
      this.alertInterestInput = !added;
      if (added) this.interestTextInput = '';
    }
  }

  removeFromSelectedCategories(category: string): void {
    this.chosenCategories = this.chosenCategories.filter(e => e !== category);
    if (this.categories.includes(category)) this.categoriesCopy.push(category);
  }

  removeFromSelectedInterests(category: string): void {
    this.chosenInterests = this.chosenInterests.filter(e => e !== category);
    if (this.categories.includes(category)) this.categoriesCopy.push(category);
  }

  resetSelectedCategories(): void {
    this.chosenCategories.forEach(c => {
      if (this.categories.includes(c)) this.categoriesCopy.push(c);
    });
    this.chosenCategories = [];
  }

  resetSelectedInterests(): void {
    this.chosenInterests.forEach(c => {
      if (this.categories.includes(c)) this.categoriesCopy.push(c);
    });
    this.chosenInterests = [];
  }

  async addPatient(): Promise<void> {
    this.addingPatient = true;
    this.caregiverPatientRegisterData.patient.profileImageURL = this.profileImage.imageURL;
    this.caregiverPatientRegisterData.patient.birthDate = new Date(
      this.birthDate.year, this.birthDate.month, this.birthDate.day, 0, 0, 0, 0
    );
    this.caregiverPatientRegisterData.patient.cities    = this.categoryService.parseCategories(this.chosenCategories);
    this.caregiverPatientRegisterData.patient.interests = this.categoryService.parseCategories(this.chosenInterests);

    const token = this.authenticationService.getCurrentCaregiverToken()!;
    const patientId = await this.caregiverService.addPatient(token, this.caregiverPatientRegisterData);

    if (patientId) {
      this.patientService.setCurrentPatient(
        await this.patientService.getPatientById(token, patientId)
      );
      this.router.navigate([
        this.patientService.getCurrentPatient() == null
          ? '/caregiver/persons'
          : '/caregiver/person/info'
      ]);
    } else {
      this.added = false;
      this.addingPatient = false;
    }
  }
}