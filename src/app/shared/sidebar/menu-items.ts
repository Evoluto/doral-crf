import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    id: 1,
    path: '/applications',
    title: 'Applications',
    icon: 'fa fa-folder',
    class: '',
    ddclass: '',
    extralink: false,
    submenu: [
      {
        id: 101,
        path: '/applications-add',
        title: 'Add New',
        icon: 'fa fa-plus',
        class: '',
        ddclass: '',
        extralink: false,
        submenu: []
      }
    ]
  }
];
