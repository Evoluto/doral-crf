import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { take, exhaustMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private toastr: ToastrService) {}

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
      if (err.status === 401 || err.status === 403) {
        this.toastr.error("Invalid Token", "Authorization Error");
        this.authService.logout();
      }
      return throwError(err);
    }
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        req = req.clone({
                url: environment.apiUrl + req.url,
        });

        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = 
          req.clone(
            {
              headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': `Bearer  ${user.access_token}`
              })
            }
          );
        
        return next.handle(modifiedReq)
          .pipe(
            catchError( response => 
              this.handleAuthError(response)
            )
          );
      })
    );
  }
}
