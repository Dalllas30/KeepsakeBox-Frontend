import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RegisterStep1Data } from '../../models/register-step1-data.model';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BirthDateInputComponent } from '../../templates/birth-date-input/birth-date-input.component';

@Component({
  selector: 'app-register-step1',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, BirthDateInputComponent],
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.css']
})

export class RegisterStep1Component {
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  @Input() step1Data!: RegisterStep1Data;
  @Output() backToLogin: EventEmitter<void> = new EventEmitter();
  @Output() emailValidationCompleted: EventEmitter<void> = new EventEmitter();

  public validEmailInput: boolean = true;
  public validPasswordFields: boolean = true;
  public validEmail: boolean = true;
  public validatingEmail: boolean = false;
  public lastEmailValidated: string = "";

  constructor(
    private authenticationService: AuthenticationService,
  ) {}


  isValidEmailValue(email: NgModel) {
    this.validEmailInput = email.valid ?? true;
    if (!this.validEmail) {
      if (this.lastEmailValidated != this.step1Data.email) {
        this.validEmail = true;
      }
    }
  }

  arePasswordsValid(password: NgModel, confirmPassword: NgModel): void {
    this.validPasswordFields =
      (password.value == "") || (confirmPassword.value == "") ||
      this.step1Data.password == this.step1Data.confirmPassword;
  }

  navigateToLogin(): void {
    this.backToLogin.emit();
  }

  async validateEmail(): Promise<void> {
    this.validatingEmail = true;
    if (await this.authenticationService.validateEmail(this.step1Data.email)) {
      this.lastEmailValidated = this.step1Data.email;
      this.emailValidationCompleted.emit();
      this.validatingEmail = false;
    } else {
      this.validEmail = false;
      this.validatingEmail = false;
    }
  }
}
