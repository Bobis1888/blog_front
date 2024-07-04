import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from "@angular/common/http";
import {catchError, of, throwError} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";


export const appCoreInterceptor: HttpInterceptorFn = (req, next) => {

  req = req.clone({
    withCredentials: true,
  });

  let router = inject(Router);

  return next(req).pipe(
    catchError((err: any) => {
      let resError = err;

      if (err instanceof HttpErrorResponse) {
        resError = err.error;

        if (err.status == 502 && err.statusText == "Bad Gateway"
          || (err.url?.endsWith('auth/state') && err.status == 404)) {
          setTimeout(() => {
            router.navigate(['update-process']).then();
          }, 100);
          return throwError(() => resError);
        }

        // Handle HTTP errors
        if (err.status === 401) {
          console.error('Unauthorized request:', err);
          // You might trigger a re-authentication flow or redirect the user here
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => resError);
    })
  );
};
