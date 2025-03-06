import {HttpClient, provideHttpClient, withInterceptors,} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection,} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import Aura from '@primeng/themes/aura';
import {OAuthModule, OAuthService} from 'angular-oauth2-oidc';
import {providePrimeNG} from 'primeng/config';
import {routes} from './app.routes';
import {HttpRequestInterceptor} from './core/interceptor/HttpInterceptor';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {appReducer} from '@/shared/store/app.reducer';
import {SimulationEffects} from '@/shared/store/simulation/effects';
import {MessageService} from 'primeng/api';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([HttpRequestInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    })),
    {provide: OAuthService, useClass: OAuthService},
    importProvidersFrom(OAuthModule.forRoot()),
    provideStore(appReducer),
    provideEffects([SimulationEffects]),
    MessageService
  ],
};
