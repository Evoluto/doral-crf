import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouteDataService } from 'src/app/services/route-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RentalApplicationService implements Resolve<Object[]>{
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Object[] | import("rxjs").Observable<Object[]> | Promise<Object[]> {
    const projectSpecificData = this.projectSpecificService.getProjectSpecificData();
    const applicationData = this.projectSpecificService.getApplicationData();
    const subjectTableName = this.routeDataService.getData(route, 'subjectTableName');
    let observables = new Array<Observable<Object[]>>();
    let postBodies = new Array<any>();

    switch (subjectTableName) {

      case "rentalapplications-add":

        observables.push(
          this.ignatiusService
            .getQueryReportObservable(
              projectSpecificData.appData,
              { "ApplicationTableId": projectSpecificData.requiredDocumentsData.TableId }
            )
        )

        break;

      case "rentalapplications-edit":

        const recordId = route.paramMap.get("id");

        observables.push(
          this.ignatiusService
            .getQueryReportObservable(
              projectSpecificData.appData,
              { "ApplicationTableId": projectSpecificData.requiredDocumentsData.TableId }
            )
        )

        observables.push(
          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            recordId,
            projectSpecificData.rentalApplicationsData.TableId as number,
            projectSpecificData.rentalApplicationsData.RecordIdFieldId as number
          )
        );

        observables.push(this.ignatiusService.getTargetTableObservable(
          projectSpecificData.appData,
          recordId,
          projectSpecificData.documentsData.TableId,
          projectSpecificData.documentsData.RelatedRentalAssistanceFieldId as number
        ))

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