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
  login(redirectUri?: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.keycloak) return;
    this.keycloak.login({ redirectUri: redirectUri ?? window.location.href });
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
