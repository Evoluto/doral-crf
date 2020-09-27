//node modules
import { Routes } from '@angular/router';

//local
import {
  CommunicationService,
  ApplicationService,
  DashboardService,
  PaymentService,
  ProjectService
} from 'src/app/modules/dashboards/services';

import {
  DashboardComponent,
  UnauthorisedComponent,
  ApplicationsComponent,
  ProjectsComponent,
  ProjectsViewComponent,
  ExpendituresComponent,
  PaymentComponent,
  CommunicationsComponent,
  CommresponsesComponent,
  ApplicationsAddComponent,
  CommunicationsAddComponent,
  PaymentAddComponent,
  PaymentViewComponent
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
        path: 'applications',
        component: ApplicationsComponent,
        data: {
          title: 'Applications',
          subjectTableName: 'applications',
          urls: [
            { title: '' }
          ]
        }
      },
      {
        path: 'applications-add',
        component: ApplicationsAddComponent,
        data: {
          title: 'Add Applications',
          subjectTableName: 'applications-add',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: ApplicationService
        }
      },
      {
        path: 'applications-edit/:id',
        component: ApplicationsAddComponent,
        data: {
          title: 'Edit Applications',
          subjectTableName: 'applications-edit',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: ApplicationService
        }
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        data: {
          title: 'Projects',
          subjectTableName: 'projects',
          urls: [
            { title: '' }
          ]
        }
      },
      {
        path: 'projects/view/:id',
        component: ProjectsViewComponent,
        data: {
          title: 'View Project',
          subjectTableName: 'projects-view',
          urls: [
            { title: 'View Project' }
          ]
        },
        resolve: {
          componentData: ProjectService
        }
      },
      {
        path: 'expenditures',
        component: ExpendituresComponent,
        data: {
          title: 'Expenditures',
          subjectTableName: 'expenditures',
          urls: [
            { title: '' }
          ]
        }
      },
      {
        path: 'payments',
        component: PaymentComponent,
        data: {
          title: 'Payment Requests',
          subjectTableName: 'payments',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: PaymentService
        }
      },
      {
        path: 'payments/add',
        component: PaymentAddComponent,
        data: {
          title: 'Add Payments',
          subjectTableName: 'payments-add',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: PaymentService
        }
      },
      {
        path: 'payments/edit/:id',
        component: PaymentAddComponent,
        data: {
          title: 'Edit Payments',
          subjectTableName: 'payments-edit',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: PaymentService
        }
      },
      {
        path: 'payments/view/:id',
        component: PaymentViewComponent,
        data: {
          title: 'View Payments',
          subjectTableName: 'payments-view',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: PaymentService
        }
      },
      {
        path: 'communications',
        component: CommunicationsComponent,
        data: {
          title: 'Communications',
          subjectTableName: 'threads',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: CommunicationService
        }
      },
      {
        path: 'communications/:id',
        component: CommresponsesComponent,
        data: {
          title: 'Thread Responses',
          subjectTableName: 'responses',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: CommunicationService
        }
      },
      {
        path: 'communications-add',
        component: CommunicationsAddComponent,
        data: {
          title: 'Add Ticket',
          subjectTableName: 'thread-add',
          urls: [
            { title: '' }
          ]
        },
        resolve: {
          componentData: CommunicationService
        }
      },
      {
        path: 'unauthorised',
        component: UnauthorisedComponent,
      }
    ]
  }
]
