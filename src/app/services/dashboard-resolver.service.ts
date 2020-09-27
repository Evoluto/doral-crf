import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouteDataService } from './route-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { IgnatiusService } from './ignatius.service';
import { ProjectSpecificService } from './project-specific.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolverService implements Resolve<Object[]>{
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Object[] | import("rxjs").Observable<Object[]> | Promise<Object[]> {
    const projectSpecificData = this.projectSpecificService.getProjectSpecificData();
    const applicationData = this.projectSpecificService.getApplicationData();
    const subjectTableName = this.routeDataService.getData(route, 'subjectTableName');
    let observables = new Array<Observable<Object[]>>();
    let postBodies = new Array<any>();

    switch (subjectTableName) {
      case "threads":

        // postBodies.push({ "ApplicationTableId": projectSpecificData.commThreadData.TableId });

        // observables = observables.concat(
        //   this.ignatiusService.getQueryReportObservables(
        //     projectSpecificData.appData,
        //     postBodies
        //   )
        // );

        break;
    }

    this.spinner.show();
    return forkJoin(observables)
  }

  constructor(
    private spinner: NgxSpinnerService,
    private ignatiusService: IgnatiusService,
    private routeDataService: RouteDataService,
    private projectSpecificService: ProjectSpecificService) { }
}