//node modules
import { Routes } from '@angular/router';

//local
import {
  BusinessApplicationService,
  RentalApplicationService,
  DashboardService,
} from 'src/app/modules/dashboards/services';

import {
  DashboardComponent,
  UnauthorisedComponent,
  BusinessApplicationsAddComponent,
  RentalApplicationsAddComponent
} from 'src/app/modules/dashboards/components';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: '',
          subjectTableName: 'dashboard',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: DashboardService
        }
      },
      {
        path: 'businessapplications-add',
        component: BusinessApplicationsAddComponent,
        data: {
          title: 'Add Business Application',
          subjectTableName: 'businessapplications-add',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: BusinessApplicationService
        }
      },
      {
        path: 'businessapplications-edit/:id',
        component: BusinessApplicationsAddComponent,
        data: {
          title: 'Edit Business Application',
          subjectTableName: 'businessapplications-edit',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: BusinessApplicationService
        }
      },
      {
        path: 'rentalapplications-add',
        component: RentalApplicationsAddComponent,
        data: {
          title: 'Add Rental Application',
          subjectTableName: 'rentalapplications-add',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: RentalApplicationService
        }
      },
      {
        path: 'rentalapplications-edit/:id',
        component: RentalApplicationsAddComponent,
        data: {
          title: 'Edit Rental Application',
          subjectTableName: 'rentalapplications-edit',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: RentalApplicationService
        }
      },
      {
        path: 'unauthorised',
        component: UnauthorisedComponent,
      }
    ]
  }
]
