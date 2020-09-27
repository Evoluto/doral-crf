import { Routes } from '@angular/router';

import { NotfoundComponent } from './404/not-found.component';
import { LoginComponent } from './login/login.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'passwordrecovery',
        component: LoginComponent
      }
    ]
  }
];
