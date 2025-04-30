import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import Aura from "@primeng/themes/aura";
import { AuthConfig, OAuthModule, OAuthStorage } from "angular-oauth2-oidc";
import { providePrimeNG } from "primeng/config";
import { routes } from "./app.routes";
import { HttpRequestInterceptor } from "./core/interceptor/HttpInterceptor";
import { MessageService } from "primeng/api";
import { authAppInitializerFactory } from "@/core/config/auth-app-initializer.factory";
import { AuthService } from "./core/service/auth.service";
import { authConfig } from "@/core/config/auth.config";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "i18n/", ".json");
}

export function storageFactory(): OAuthStorage {
  return sessionStorage;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([HttpRequestInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".my-app-dark",
        },
      },
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    importProvidersFrom(OAuthModule.forRoot()),
    provideAppInitializer(() => {
      const initializerFn = authAppInitializerFactory(inject(AuthService));
      return initializerFn();
    }),
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthStorage, useFactory: storageFactory },
    MessageService,
  ],
};
