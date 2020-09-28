import { Routes } from '@angular/router';

import {
  NotfoundComponent,
  LoginComponent,
  RegistrationComponent,
  HomeComponent,
  PreRegistrationComponent
} from 'src/app/modules/authentication/components';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'passwordrecovery',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
      {
        path: 'pre-register',
        component: PreRegistrationComponent
      }
    ]
  }
];
