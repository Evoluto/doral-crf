import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationRoutes } from './authentication.routing';

import {
  NotfoundComponent,
  LoginComponent,
  RegistrationComponent,
  HomeComponent,
  PreRegistrationComponent
} from 'src/app/modules/authentication/components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    NgbModule
  ],
  declarations: [
    NotfoundComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    PreRegistrationComponent
  ]
})
export class AuthenticationModule {}
