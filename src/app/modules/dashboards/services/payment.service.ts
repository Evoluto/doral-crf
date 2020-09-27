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
export class PaymentService implements Resolve<Object[]>{
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Object[] | import("rxjs").Observable<Object[]> | Promise<Object[]> {
    const projectSpecificData = this.projectSpecificService.getProjectSpecificData();
    const applicationData = this.projectSpecificService.getApplicationData();
    const subjectTableName = this.routeDataService.getData(route, 'subjectTableName');
    let observables = new Array<Observable<Object[]>>();
    let postBodies = new Array<any>();

    switch (subjectTableName) {

      case "payments":

        postBodies.push({ "ApplicationTableId": projectSpecificData.paymentRequestData.TableId })

        observables = observables.concat(
          this.ignatiusService.getQueryReportObservables(
            projectSpecificData.appData,
            postBodies
          )
        );

        break;

      case "payments-add":

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.paymentRequestData.MilestoneMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.documentsData.DocumentTypeExpenditureCategoryMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getQueryReportObservable(
            projectSpecificData.appData,
            { "ApplicationTableId": projectSpecificData.projectsData.TableId }
          )
        )

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.treasuryReportingData.ExpenditureCategoryMultipleChoiceID.toString()
          )
        )

        break;

      case "payments-edit":

        const recordId = route.paramMap.get("id");

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.paymentRequestData.MilestoneMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.documentsData.DocumentTypeExpenditureCategoryMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getQueryReportObservable(
            projectSpecificData.appData,
            { "ApplicationTableId": projectSpecificData.projectsData.TableId }
          )
        )

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.treasuryReportingData.ExpenditureCategoryMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            recordId,
            projectSpecificData.paymentRequestData.TableId as number,
            projectSpecificData.paymentRequestData.RecordIdFieldId as number
          )
        );

        observables.push(
          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            recordId,
            projectSpecificData.treasuryReportingData.TableId as number,
            projectSpecificData.treasuryReportingData.RelatedPaymentRequestsFieldId as number
          )
        );

        break;

      case "payments-view":

        const paymentReqId = route.paramMap.get("id");

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.paymentRequestData.MilestoneMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.documentsData.DocumentTypeExpenditureCategoryMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getQueryReportObservable(
            projectSpecificData.appData,
            { "ApplicationTableId": projectSpecificData.projectsData.TableId }
          )
        )

        observables.push(
          this.ignatiusService.getDropdownValues(
            projectSpecificData.treasuryReportingData.ExpenditureCategoryMultipleChoiceID.toString()
          )
        )

        observables.push(
          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            paymentReqId,
            projectSpecificData.paymentRequestData.TableId as number,
            projectSpecificData.paymentRequestData.RecordIdFieldId as number
          )
        );

        observables.push(
          this.ignatiusService.getTargetTableObservable(
            projectSpecificData.appData,
            paymentReqId,
            projectSpecificData.treasuryReportingData.TableId as number,
            projectSpecificData.treasuryReportingData.RelatedPaymentRequestsFieldId as number
          )
        );

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