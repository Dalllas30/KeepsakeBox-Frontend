import { APP_INITIALIZER, ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { caregiverIdInterceptor } from './core/interceptors/caregiver-id.interceptor';
import { KeycloakService } from './core/services/keycloak.service';
import { AuthenticationService } from './core/services/authentication.service';

/**
 * APP_INITIALIZER factory — initialises Keycloak, then immediately resolves
 * the current user's identity if Keycloak already has an authenticated session
 * (i.e. the user just came back from the Keycloak login page).
 *
 * This runs before the router activates any route, so by the time guards and
 * components mount, currentUserRole and the caregiver cache are already set.
 *
 * On the server (SSR) everything is skipped so universal rendering is not blocked.
 */
function initKeycloak(
  keycloak: KeycloakService,
  authService: AuthenticationService,
  platformId: Object
) {
  return async () => {
    if (!isPlatformBrowser(platformId)) {
      return false;
    }
    const authenticated = await keycloak.init();
    if (authenticated) {
      // Keycloak just finished the OIDC code exchange — populate role + cache.
      await authService.resolveCurrentUser();
    }
    return authenticated;
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // -------------------------------------------------------------------------
    // HttpClient with functional interceptors (Angular 21 style)
    // -------------------------------------------------------------------------
    provideHttpClient(withInterceptors([authInterceptor, caregiverIdInterceptor])),

    // provideAnimationsAsync(),

    // -------------------------------------------------------------------------
    // Keycloak initialisation + identity resolution
    // -------------------------------------------------------------------------
    {
      provide: APP_INITIALIZER,
      useFactory: (
        keycloak: KeycloakService,
        authService: AuthenticationService,
        platformId: Object
      ) => initKeycloak(keycloak, authService, platformId),
      deps: [KeycloakService, AuthenticationService, PLATFORM_ID],
      multi: true,
    },

    // -------------------------------------------------------------------------
    // i18n
    // -------------------------------------------------------------------------
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { prefix: './assets/i18n/', suffix: '.json' },
    },
    provideTranslateService({
      defaultLanguage: 'pt',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
      },
    }),
  ],
};
