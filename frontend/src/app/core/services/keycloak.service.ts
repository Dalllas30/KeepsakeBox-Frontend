/**
 * Wrapper around keycloak-js that is safe to use in an Angular SSR context.
 *
 * keycloak-js accesses browser-only globals (window, document, localStorage)
 * at import time, so we load it lazily behind an isPlatformBrowser guard.
 *
 * Usage
 * -----
 *   await keycloakService.init();          // call once in APP_INITIALIZER
 *   const token = await keycloakService.getToken();
 *   keycloakService.login();               // redirects to Keycloak login page
 *   keycloakService.logout();              // redirects to Keycloak logout page
 *
 * Configuration is read from environment.keycloak.
 */

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private keycloak: any = null;
  private initPromise: Promise<boolean> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // --------------------------------------------------------------------------
  // Initialisation
  // --------------------------------------------------------------------------

  /**
   * Initialise Keycloak. Safe to call multiple times — repeated calls return
   * the same promise. Must be awaited before calling login() / getToken().
   *
   * Returns true if the user is already authenticated (e.g. after a redirect
   * back from the Keycloak login page), false otherwise.
   */
  init(): Promise<boolean> {
    if (this.initPromise) {
      return this.initPromise;
    }

    if (!isPlatformBrowser(this.platformId)) {
      // SSR — skip Keycloak entirely
      this.initPromise = Promise.resolve(false);
      return this.initPromise;
    }

    this.initPromise = import('keycloak-js').then(({ default: Keycloak }) => {
      this.keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      });

      return this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false,   // avoids cross-origin iframe issues in dev
      });
    }).catch((err: any) => {
      console.error('[KeycloakService] init error', err);
      return false;
    });

    return this.initPromise;
  }

  // --------------------------------------------------------------------------
  // Authentication state
  // --------------------------------------------------------------------------

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated === true;
  }

  // --------------------------------------------------------------------------
  // Token helpers
  // --------------------------------------------------------------------------

  /**
   * Returns a valid access token, refreshing it first if it expires within
   * the next 30 seconds.  Returns null on SSR or if not authenticated.
   */
  async getToken(): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) {
      return null;
    }
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Synchronous access to the raw token string.
   * Prefer getToken() in most situations — it ensures the token is fresh.
   */
  getRawToken(): string | null {
    return this.keycloak?.token ?? null;
  }

  /**
   * Force a token refresh so newly-assigned realm roles (e.g. from onboarding)
   * land in the claims without a full re-login
   */
  async forceRefreshToken(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) {
      return false;
    }
    try {
      // -1 forces a refresh even though the current token isn't near expiry.
      await this.keycloak.updateToken(-1);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns the decoded token payload, or null if not available.
   */
  getTokenParsed(): Record<string, any> | null {
    return this.keycloak?.tokenParsed ?? null;
  }

  /**
   * Returns the realm roles granted to the current user.
   */
  getRoles(): string[] {
    return this.keycloak?.realmAccess?.roles ?? [];
  }

  // --------------------------------------------------------------------------
  // Login / logout
  // --------------------------------------------------------------------------

  /**
   * Redirect the browser to the Keycloak login page.
   * @param redirectUri  Where Keycloak should redirect after a successful login.
   *                     Defaults to the current page.
   */
  login(redirectUri?: string, locale?: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) return;
    // Default redirect: app root.  Keycloak bounces back there after login;
    // APP_INITIALIZER runs resolveCurrentUser(), then the role guard or the
    // login/register components' ngOnInit routes the user to /caregiver/persons.
    // Never redirect back to auth pages — that causes an unnecessary extra
    // round-trip before navigating into the app.
    const AUTH_PAGES = ['/login', '/register'];
    const target = redirectUri ?? (
      AUTH_PAGES.some(p => window.location.pathname.startsWith(p))
        ? window.location.origin + '/'
        : window.location.href
    );
    // `locale` opens the themed login page in the language picked in-app.
    this.keycloak.login({ redirectUri: target, ...(locale ? { locale } : {}) });
  }

  /**
   * Redirect the browser to the Keycloak self-registration page (themed via the
   * "keepsakebox" Keycloakify login theme). Account creation happens in
   * Keycloak; the app collects role / profile details afterwards in onboarding.
   * @param redirectUri Where Keycloak should return after sign-up. Defaults to app root.
   * @param locale      App's current language (pt/en) so the themed page matches.
   */
  register(redirectUri?: string, locale?: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) return;
    const target = redirectUri ?? window.location.origin + '/';
    this.keycloak.register({ redirectUri: target, ...(locale ? { locale } : {}) });
  }

  /**
   * Invalidate the Keycloak session and redirect to the post-logout page.
   * @param redirectUri  Where to land after logout. Defaults to app root.
   */
  logout(redirectUri?: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) return;
    this.keycloak.logout({ redirectUri: redirectUri ?? window.location.origin + '/' });
  }

  /**
   * Redirect to the Keycloak account management console.
   */
  accountManagement(): void {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) return;
    this.keycloak.accountManagement();
  }
}
