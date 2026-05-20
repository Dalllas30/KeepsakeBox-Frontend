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

/**
 * APP_INITIALIZER factory — initialises Keycloak on the browser side.
 *
 * On the server (SSR) Keycloak.init() returns immediately with false so
 * universal rendering is not blocked.
 */
function initKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () => {
    if (!isPlatformBrowser(platformId)) {
      return Promise.resolve(false);
    }
    return keycloak.init();
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
    // Keycloak initialisation
    // -------------------------------------------------------------------------
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloak: KeycloakService, platformId: Object) =>
        initKeycloak(keycloak, platformId),
      deps: [KeycloakService, PLATFORM_ID],
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
