import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { EncryptionService } from '../../core/services/encryption.service';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CancelScreenComponent, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  private router                = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private encryptionService     = inject(EncryptionService);
  
  constructor(private cdr: ChangeDetectorRef) {}

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  hideCancel          = true;
  hideChangePassword  = false;
  hidePasswordChanged = true;

  actualPassword    = '';
  nPassword         = '';
  nPasswordConfirm  = '';

  validPasswordFields = true;
  changing            = false;
  passVerified        = true;
  changed             = true;

  ngOnInit(): void {
    this.showChangePassword();
  }

  showCancel(): void {
    this.hideCancel          = false;
    this.hideChangePassword  = true;
    this.hidePasswordChanged = true;
  }

  showChangePassword(): void {
    this.hideCancel          = true;
    this.hideChangePassword  = false;
    this.hidePasswordChanged = true;
  }

  showPasswordChanged(): void {
    this.hideCancel          = true;
    this.hideChangePassword  = true;
    this.hidePasswordChanged = false;
  }

  navigateToProfile(): void {
    this.router.navigate(['caregiver/profile/info']);
  }

  arePasswordsValid(newPassword: NgModel, newPasswordConfirm: NgModel): void {
    this.validPasswordFields =
      newPassword.value === '' || newPasswordConfirm.value === '' ||
      this.nPassword === this.nPasswordConfirm;
  }

  async changePassword(): Promise<void> {
    this.changing = true;
    const token = this.authenticationService.getCurrentCaregiverToken()!;

    const isValid = await this.caregiverService.validatePassword(
      token,
      this.encryptionService.encrypt(environment.encryptionKey, this.actualPassword)
    );

    if (!isValid) {
      this.passVerified = false;
      this.changing = false;
      return;
    }

    const success = await this.caregiverService.changePassword(
      token,
      this.encryptionService.encrypt(environment.encryptionKey, this.nPassword)
    );

    if (success) {
      this.showPasswordChanged();
    } else {
      this.changed = false;
    }
    this.changing = false;
    this.cdr.detectChanges();
  }
}