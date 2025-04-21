 import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };


// //anthropics proposal which does not work
// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     // Get token from localStorage
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       console.log('Adding token to request:', request.url);
      
//       // Clone request and add authorization header
//       const authReq = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       return next.handle(authReq);
//     }
    
//     return next.handle(request);
//   }
// }

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  //console.log('Adding token to request:',token);
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  return next(req);
};