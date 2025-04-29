import { AuthConfig } from "angular-oauth2-oidc";

const baseKeyCloakUrl = "https://keycloak.check-consulting.net/realms/master";

export const authConfig: AuthConfig = {
  issuer: baseKeyCloakUrl,
  redirectUri: window.location.origin + "/dashboard",
  clientId: "scpi-invest-plus",
  responseType: "code",
  logoutUrl: baseKeyCloakUrl + "/protocol/openid-connect/logout",
  postLogoutRedirectUri: window.location.origin + "/",
  showDebugInformation: true,
  scope: "openid profile email offline_access",
  timeoutFactor: 0.75,
  clearHashAfterLogin: true,
};
