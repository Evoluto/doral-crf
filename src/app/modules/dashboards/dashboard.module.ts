//node modules
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxChartsModule } from '@swimlane/ngx-charts';


import { MaterialModule } from 'src/app/shared/material.module';



//local
import { DashboardRoutes } from './dashboard.routing';
import {
  DashboardService,
  BusinessApplicationService,
  RentalApplicationService,
  ExportService
} from 'src/app/modules/dashboards/services';

import {
  UnauthorisedComponent,
  DashboardComponent,
  BusinessApplicationsAddComponent,
  RentalApplicationsAddComponent
} from 'src/app/modules/dashboards/components';

import { AdminGuard } from 'src/app/modules/dashboards/guards';
import { DashboardResolverService } from 'src/app/services/dashboard-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild(DashboardRoutes),
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    NgbModule,
    NgbModalModule.forRoot(),
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MaterialModule,
    NgxChartsModule
  ],
  declarations: [
    UnauthorisedComponent,
    DashboardComponent,
    BusinessApplicationsAddComponent,
    RentalApplicationsAddComponent,
  ],
  providers: [
    DashboardService,
    BusinessApplicationService,
    RentalApplicationService,
    DashboardResolverService,
    CurrencyPipe,
    AdminGuard,
    ExportService
  ]
})
export class DashboardModule { }
