import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from "@angular/common/http";
import {catchError, throwError} from "rxjs";


export const appCoreInterceptor: HttpInterceptorFn = (req, next) => {

  req = req.clone({
    withCredentials: true,
  });

  return next(req).pipe(
    catchError((err: any) => {
      let resError = err;

      if (err instanceof HttpErrorResponse) {
        resError = err.error;

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
