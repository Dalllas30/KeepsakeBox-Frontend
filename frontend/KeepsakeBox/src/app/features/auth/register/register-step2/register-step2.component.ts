import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegisterStep2Data } from '../../../../core/models/register-step2-data.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileImageComponent } from '../../../../shared/profile-image/profile-image.component';
import { CaregiverTypeComponent } from '../../../../shared/caregiver-type/caregiver-type.component';

@Component({
  selector: 'app-register-step2',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ProfileImageComponent, CaregiverTypeComponent],
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.css']
})
export class RegisterStep2Component {
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  @Input() step2Data!: RegisterStep2Data;
  // Suppress the caregiver-type widget when registering an independent user.
  @Input() hideCaregiverType: boolean = false;
  @Output() backToStep1: EventEmitter<void> = new EventEmitter();
  @Output() registerSubmitted: EventEmitter<void> = new EventEmitter();

  navigateToStep1(): void {
    this.backToStep1.emit();
  }

  submitRegister() {
    this.registerSubmitted.emit();
  }
}