// Sidebar route metadata
export interface RouteInfo {
  id: number;
  path: string;
  title: string;
  icon: string;
  class: string;
  ddclass: string;
  extralink: boolean;
  submenu: RouteInfo[];
}
