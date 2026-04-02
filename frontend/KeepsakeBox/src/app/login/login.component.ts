import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../services/authentication.service';
import { EncryptionService } from '../services/encryption.service';
import { LoginData } from '../models/login-data.model';
import { LoginLoadingComponent } from './login-loading/login-loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LoginLoadingComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginData!: LoginData;
  public validEmailInput: boolean = true;
  public validLogin: boolean = true;
  public loginIn: boolean = false;
  public currentPassword: string = "";

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.loginData = new LoginData("", "");
    if (this.authenticationService.getCurrentCaregiverToken()) {
      this.router.navigate(['/caregiver/persons']);
    }
  }

  existsCurrentCaregiverToken(): boolean {
    return this.authenticationService.getCurrentCaregiverToken() != null || this.loginIn;
  }

  isValidEmailValue(email: NgModel) {
    this.validEmailInput = email.valid ?? true;
  }

  validateLogin(): void {
    this.validLogin = true;
  }

  async caregiverLogin(): Promise<void> {
    this.loginIn = true;
    this.loginData.password =
      this.encryptionService.encrypt("989$%&2!3123KeepsakeBox2021", this.currentPassword);
    if (await this.authenticationService.login(this.loginData)) {
      this.router.navigate(['/caregiver/persons']);
    } else {
      this.validLogin = false;
      this.loginIn = false;
    }
  }
}