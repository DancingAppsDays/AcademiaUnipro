import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID  } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { HttpEvent, HttpHandler, HttpRequest, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { Observable } from 'rxjs';

// // Create interceptor function
// function authInterceptor(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//   const token = localStorage.getItem('token');
  
//   if (token) {
//     const authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
    
//     return next.handle(authReq);
//   }
  
//   return next.handle(req);
// }


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(
    routes,
    withHashLocation()),
  provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
  //provideAnimations(),
  provideAnimationsAsync(),
  { provide: LOCALE_ID, useValue: 'es' }
  ]
};
