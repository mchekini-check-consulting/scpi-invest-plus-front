import { AuthConfig } from 'angular-oauth2-oidc';


export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://keycloak.check-consulting.net/realms/master',
  redirectUri: window.location.origin,
  clientId: 'scpi-invest-plus',
  responseType: 'code',
  logoutUrl : 'https://keycloak.check-consulting.net/realms/master/protocol/openid-connect/logout',
  postLogoutRedirectUri: window.location.origin,
  showDebugInformation: true,
  scope: 'openid profile email offline_access',
  timeoutFactor: 0.75,
};
