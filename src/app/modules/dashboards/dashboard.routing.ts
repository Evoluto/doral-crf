//node modules
import { Routes } from '@angular/router';

//local
import {
  BusinessApplicationService,
  DashboardService,
} from 'src/app/modules/dashboards/services';

import {
  DashboardComponent,
  UnauthorisedComponent,
  //ProgramsComponent,
  BusinessApplicationsComponent,
  BusinessApplicationsAddComponent,
  //RentalApplicationsComponent,
  //RentalApplicationsAddComponent
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
          title: 'Funding Overview',
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
        component: BusinessApplicationsComponent,
        data: {
          title: 'Business Applications',
          subjectTableName: 'businessapplications',
          urls: [
            { title: '' }
          ]
        }
      },
      {
        path: 'businessapplications-add',
        component: BusinessApplicationsAddComponent,
        data: {
          title: 'Add Business Applications',
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
          title: 'Edit Business Applications',
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
        path: 'unauthorised',
        component: UnauthorisedComponent,
      }
    ]
  }
]
