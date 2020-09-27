import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class RouteDataService {
    getData(route: ActivatedRouteSnapshot, data: string): string{
        while(route){
          if (route.firstChild) {
            route = route.firstChild;
          } else if (route.data && route.data[data]) {
            return route.data[data];
          }else{
            return null;
          }
        }
    }
}