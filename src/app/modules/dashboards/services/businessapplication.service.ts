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
export class BusinessApplicationService implements Resolve<Object[]>{
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Object[] | import("rxjs").Observable<Object[]> | Promise<Object[]> {
    const projectSpecificData = this.projectSpecificService.getProjectSpecificData();
    const applicationData = this.projectSpecificService.getApplicationData();
    const subjectTableName = this.routeDataService.getData(route, 'subjectTableName');
    let observables = new Array<Observable<Object[]>>();
    let postBodies = new Array<any>();

    switch (subjectTableName) {

      case "businessapplications-add":

        // NES - FOR NOW
        // observables.push(
        //   this.ignatiusService.getDropdownValues(
        //     projectSpecificData.documentsData.DocumentTypeSelectionMultipleChoiceID.toString()
        //   )
        // )

        break;

      case "businessapplications-edit":

        const recordId = route.paramMap.get("id");

        // NES - FOR NOW
        // observables.push(
        //   this.ignatiusService.getDropdownValues(
        //     projectSpecificData.documentsData.DocumentTypeSelectionMultipleChoiceID.toString()
        //   )
        // )

        observables.push(
          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            recordId,
            projectSpecificData.businessApplicationsData.TableId as number,
            projectSpecificData.businessApplicationsData.RecordIdFieldId as number
          )
        );

        observables.push(this.ignatiusService.getTargetTableObservable(
          projectSpecificData.appData,
          recordId,
          projectSpecificData.documentsData.TableId,
          projectSpecificData.documentsData.RelatedBusinessApplicationsFieldId as number
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