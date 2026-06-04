import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverTypeComponent } from '../../../shared/caregiver-type/caregiver-type.component';
import { CaregiverType } from '../../../core/models/caregiver-type.model';

// Collects the app-specific role + extras after Keycloak registration and
// creates the local profile row. Reached only when GET /users/me 404s.
@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CaregiverTypeComponent],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthenticationService);

  /** null = role not chosen yet (step A); otherwise the chosen branch. */
  role = signal<'caregiver' | 'independent' | null>(null);
  submitting = signal(false);
  failed = signal(false);

  caregiverType = new CaregiverType('Informal', '');

  // Independent branch.
  displayName = '';
  education = '';

  ngOnInit(): void {
    // Safety net in case the guard let an already resolved user through.
    if (this.auth.isLoggedIn() && !this.auth.getNeedsOnboarding()) {
      this.router.navigate(['/caregiver/persons']);
    }
  }

  chooseCaregiver(): void {
    this.role.set('caregiver');
  }

  chooseIndependent(): void {
    this.role.set('independent');
  }

  back(): void {
    this.role.set(null);
    this.failed.set(false);
  }

  async submit(): Promise<void> {
    this.submitting.set(true);
    this.failed.set(false);

    const ok = this.role() === 'independent'
      ? await this.auth.onboardIndependent(this.displayName, this.education)
      : await this.auth.onboardCaregiver(this.caregiverType.type);

    if (ok) {
      this.router.navigate(['/caregiver/persons']);
    } else {
      this.submitting.set(false);
      this.failed.set(true);
    }
  }
}
