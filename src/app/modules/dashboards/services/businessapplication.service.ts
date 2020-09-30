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

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.businessApplicationsData.OrganizationTypeMultipleChoiceID.toString()
          ),
          this.ignatiusService.getDropdownValues(
            projectSpecificData.businessApplicationsData.OwnOrLeaseMultipleChoiceID.toString()
          ),
          this.ignatiusService
            .getQueryReportObservable(
              projectSpecificData.appData,
              {
                "ApplicationTableId": projectSpecificData.requiredDocumentsData.TableId,
                "ConditionGroups": [
                  {
                    "Type": "all",
                    "Conditions": [
                      {
                        "ConditionField": {
                          "Id": projectSpecificData.requiredDocumentsData.RecordFormFieldId
                        },
                        "OperationType": "is equal",
                        "Value": 'Business'
                      }
                    ]
                  }
                ]
              })
        )



        break;

      case "businessapplications-edit":

        const recordId = route.paramMap.get("id");

        observables.push(

          this.ignatiusService.getDropdownValues(
            projectSpecificData.businessApplicationsData.OrganizationTypeMultipleChoiceID.toString()
          ),

          this.ignatiusService.getDropdownValues(
            projectSpecificData.businessApplicationsData.OwnOrLeaseMultipleChoiceID.toString()
          ),

          this.ignatiusService
            .getQueryReportObservable(
              projectSpecificData.appData,
              {
                "ApplicationTableId": projectSpecificData.requiredDocumentsData.TableId,
                "ConditionGroups": [
                  {
                    "Type": "all",
                    "Conditions": [
                      {
                        "ConditionField": {
                          "Id": projectSpecificData.requiredDocumentsData.RecordFormFieldId
                        },
                        "OperationType": "is equal",
                        "Value": 'Business'
                      }
                    ]
                  }
                ]
              }),

          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            recordId,
            projectSpecificData.businessApplicationsData.TableId as number,
            projectSpecificData.businessApplicationsData.RecordIdFieldId as number
          ),

          this.ignatiusService
            .getQueryReportObservable(
              projectSpecificData.appData,
              {
                "ApplicationTableId": projectSpecificData.documentsData.TableId,
                "ConditionGroups": [
                  {
                    "Type": "all",
                    "Conditions": [
                      {
                        "ConditionField": {
                          "Id": projectSpecificData.documentsData.RelatedBusinessAssistanceFieldId
                        },
                        "OperationType": "is equal",
                        "Value": recordId
                      },
                      {
                        "ConditionField": {
                          "Id": projectSpecificData.documentsData.DocumentTypeFieldId
                        },
                        "OperationType": "is equal",
                        "Value": 'Business Application'
                      }
                    ]
                  }
                ]
              })
        )

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