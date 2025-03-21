import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {catchError, finalize, Observable, pipe, switchMap, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });

      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')
              && !authReq.url.includes('/users') && !authReq.url.includes('/comments') && !authReq.url.includes('/requests')) {
              return this.handle401Error(authReq, next);
            }
            return throwError(() => error);
          }),
        );
    }

    return next.handle(req)
      .pipe(

      );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = "Ошибка авторизации";
          }

          if (error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReq = req.clone({
            headers: req.headers.set('x-access-token', refreshResult.accessToken)
          });

          return next.handle(authReq);
        }),
        catchError(error => {
          this.authService.removeTokens();
          this.router.navigate(['/']);
          return throwError(() => error);
        })
      );
  }
}
