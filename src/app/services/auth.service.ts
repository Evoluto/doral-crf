import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { BehaviorSubject, throwError, Observable, forkJoin } from 'rxjs';
import { catchError, tap, mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PasswordRecoveryData } from '../models/password-recovery-data';
import { environment } from 'src/environments/environment';
import { AppData } from '../models/app-data';
import { ProjectSpecificService } from './project-specific.service';
import { RoleData } from '../models/role-data';
import * as crypto from 'crypto-js';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private link: ProjectSpecificService) { }

  user = new BehaviorSubject<User>(null);

  encryptData(data) {

    try {
      return crypto.AES.encrypt(JSON.stringify(data), localStorage.getItem('session').toString()).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data) {

    try {
      const bytes = crypto.AES.decrypt(data, localStorage.getItem('session').toString());
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(crypto.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  register(user) {
    const body = [{
      Email: user.email,
      Password: user.password,
      Role: 'participant',
      ApplicationIds: [119],
      ApplicationRoleIds: [700]
    }];
        
    return this.http.post<string>('/api/user/create', body)
      .pipe(
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  signIn(username: string, password: string): Observable<User> {
    const tokenUrl = '/token';
    let tokenParams = new HttpParams();
    tokenParams = tokenParams.append('grant_type', 'password');
    tokenParams = tokenParams.append('username', username);
    tokenParams = tokenParams.append('password', password);

    const tokenOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const tokenObservable =
      this.http.post<User>(tokenUrl, tokenParams, tokenOptions)
        .pipe(
          tap(user => {
            this.user.next(user);
            localStorage.setItem('session', user.access_token.toString());
            let user_data = JSON.stringify(user).toString();
            localStorage.setItem('userData', user_data);
          }
          )
        );

    let rolesParams = new HttpParams();
    rolesParams = rolesParams.append('Email', username);
    rolesParams = rolesParams.append('PasswordHash', password);
    const loginUrl = '/api/user/login';

    const rolesObservable =
      this.http.post<RoleData>(loginUrl, rolesParams)
        .pipe(
          tap(roleData => {
            localStorage.setItem(
              'permissionData',
              JSON.stringify(roleData.Rights).toString());

            localStorage.setItem(
              'applicationData', this.getApplicationData(roleData.Rights));
          })
        );

    return forkJoin<User, RoleData>(tokenObservable, rolesObservable).
      pipe(
        catchError(this.handleError),
        mergeMap(() => {
          return this.http.get<AppData>(`/api/applicationdata?applicationId=${environment.applicationId}`)
            .pipe(
              map((appData: AppData) => {
                try {
                  this.link.createProjectSpecificData(appData);
                  return this.user.value;
                } catch (e) {
                  const error = e as Error;
                  console.log(error.message);
                  this.handleError();
                  return null;
                }
              })
            )
        }
        )
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.access_token,
      new Date(userData['.expires']),
      userData.userName,
      userData.fullName
    );

    this.user.next(loadedUser);
  }

  changePassword(oldPassword: String, newPassword: String) {
    let query = {
      Email: this.user.value.userName,
      PasswordConfirm: newPassword,
      OldPassword: oldPassword
    }
    const url = '/api/user/updateprofile';
    return this.http.post<Object[]>(url, query)
      .pipe(
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  forgotPassword(username: string) {
    let forgotPassword =
      new PasswordRecoveryData(
        username,
        environment.deploymentUrl,
        null,
        null
      )

    return this.http.post<string>('/api/user/forgotpassword', forgotPassword)
      .pipe(
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  recoverPassword(passwordRecoveryData: PasswordRecoveryData) {
    return this.http.post<string>('/api/user/recoverpassword', passwordRecoveryData)
      .pipe(
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  private handleError() {
    localStorage.clear();
    return throwError('Error Logging In');
  }

  private getApplicationData(data): any {
    const resourcesData = data.find(elem => elem.Name === 'Resources');
    if (!resourcesData) return null;
    if (!resourcesData.ApplicationRoles) return null;
    return JSON.stringify({
      id: resourcesData.ApplicationRoles['Id'],
      name: resourcesData.ApplicationRoles['Name']
    });
  }

  checkAdmin(): boolean {
    const appData = this.storage.getItem('applicationData');
    if (!appData) return false;
    const pattern = /Admin/g;
    return Boolean(pattern.test(appData.name));
  }

  checkUserSession(): boolean {
    const userSessionData = this.storage.getItem('userSessionData');
    if (!userSessionData) return false;
    return Boolean(userSessionData.related_companies);
  }
  
}
