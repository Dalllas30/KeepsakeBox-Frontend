/**
 * Used to:
 *  - route post-login redirects (caregiver -> /caregiver, independent -> /independent)
 *  - drive the role-aware route guard (see core/guards/role.guard.ts)
 *  - decide which collection a register call hits (caregivers vs independents)
 *
 * Once Keycloak is in place, the role will come from a realm-role claim in
 * the token; until then it is resolved by AuthenticationService.login().
 */

export type UserRole = 'caregiver' | 'independent';

export const USER_ROLES = {
  CAREGIVER: 'caregiver' as UserRole,
  INDEPENDENT: 'independent' as UserRole,
} as const;
