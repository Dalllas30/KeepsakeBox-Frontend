import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { KeycloakService } from '../../../core/services/keycloak.service';

// Account creation happens on Keycloak's register page, so this route is just a
// redirect (mirrors login.component).
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  template: '',
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthenticationService);
  private keycloak = inject(KeycloakService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      const target = this.auth.getNeedsOnboarding() ? '/onboarding' : '/caregiver/persons';
      this.router.navigate([target]);
      return;
    }

    // Open the themed Keycloak register page in the app's current language.
    const locale = this.translate.currentLang || this.translate.getDefaultLang() || undefined;
    this.keycloak.register(undefined, locale);
  }
}
