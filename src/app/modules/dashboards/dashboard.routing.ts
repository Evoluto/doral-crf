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
  RentalApplicationsAddComponent,
  BusinessapplicationsComponent,
  BusinessapplicationsViewComponent,
  RentalapplicationsComponent,
  RentalapplicationsViewComponent
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
        path: 'businessapplications',
        component: BusinessapplicationsComponent,
        data: {
          title: '',
          subjectTableName: 'businessapplications',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: BusinessApplicationService
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
        path: 'businessapplications-view/:id',
        component: BusinessapplicationsViewComponent,
        data: {
          title: 'View Business Application',
          subjectTableName: 'businessapplications-view',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: BusinessApplicationService
        }
      },
      {
        path: 'rentalapplications',
        component: RentalapplicationsComponent, 
        data: { 
          title: 'Rental Applications',
          subjectTableName: 'rentalapplications',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: RentalApplicationService
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
        path: 'rentalapplications-view/:id',
        component: BusinessapplicationsViewComponent,
        data: {
          title: 'Rental Application',
          subjectTableName: 'rentalapplications-view',
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
