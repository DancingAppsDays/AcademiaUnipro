import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(withFetch()),
  //provideAnimations(),
  provideAnimationsAsync(),
  { provide: LOCALE_ID, useValue: 'es' }
  ]
};
