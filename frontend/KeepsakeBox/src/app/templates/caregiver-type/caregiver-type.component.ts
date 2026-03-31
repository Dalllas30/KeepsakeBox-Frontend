import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverType } from '../../models/caregiver-type.model';

@Component({
  selector: 'app-caregiver-type',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './caregiver-type.component.html',
  styleUrls: ['./caregiver-type.component.css']
})
export class CaregiverTypeComponent {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';

  @Input() caregiverType!: CaregiverType;

  public specialitiesPT = ['Geriatria','Medicina','Neurologia','Psicologia','Terapia'];
  public specialitiesENG = ['Geriatrics','Medicine','Neurology','Psychology','Therapist'];

  setFormalCaregiveType(): void {
    this.caregiverType.type = "Formal";
  }

  setInformalCaregiveType(): void {
    this.caregiverType.type = "Informal";
    this.caregiverType.speciality = "";
  }
}