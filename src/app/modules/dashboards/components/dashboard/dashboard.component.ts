import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { PopupModel } from 'src/app/modules/dashboards/models/popup';
import { FormActionData, FieldListItem, Where } from 'src/app/models/form-action-data';
import { StorageService } from 'src/app/services/storage.service';
import { PackageJob } from 'src/app/models/package';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private projectSpecificService: ProjectSpecificService,
    private ignatiusService: IgnatiusService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private storageService: StorageService
  ) { }

  modelConfig: PopupModel;
  doralData: any = [];

  businessApplicationList: Array<any> = []
  selectedBusinessRow: any;


  rentalApplicationList: Array<any> = [];
  selectedRentalRow: any;
  applicationData: any;
  userData: any;
  certifyDetails: any = {};


  ngOnInit() {
    const componentData = this.route.snapshot.data['componentData'];
    this.doralData = this.projectSpecificService.getProjectSpecificData();
    this.businessApplicationList = componentData[0];
    this.rentalApplicationList = componentData[1];
    this.applicationData = this.projectSpecificService.getApplicationData();
    this.userData = this.storageService.getItem('userData');
    this.spinner.hide();
  }

  editRentalRecord(id) {
    this.router.navigate([`rentalapplications-edit/${id}`])
  }

  openSubmitRentalApplicationPopup(row, content) {
    this.selectedRentalRow = row;
    this.modelConfig = new PopupModel();
    this.modelConfig['type'] = 'rental';
    this.modelConfig.title = 'Certification / Certificación - Submit Rental Application';
    this.modelConfig.settings.size = 'lg';
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  submitApplication(type) {
    if (type == 'business') {
      this.submitBusinessApplication();
    } else if (type == 'rental') {
      this.submitRentalApplication();
    }
  }

  getCertifyObj() {
    const obj = {
      certifier_name: this.certifyDetails.certifier_name,
      certify: this.certifyDetails.certify && 'True',
      certified_dt: new Date(),
      certified_by: this.userData.userName
    }
    if (this.certifyDetails.certifier_title) {
      obj['certifier_title'] = this.certifyDetails.certifier_title;
    }
    return obj;
  }

  submitRentalApplication() {
    const obj = { ...this.getCertifyObj() };
    //obj['date_of_applicant_submission'] = new Date();
    //obj['submitted_by'] = this.loggedInuserEmail;
    obj['status'] = 'Submitted';
    this.updateRentalApplication(obj);
  }

  private async updateRentalApplication(appObject) {
    try {
      this.modelConfig.busy = true;
      const recordFAD = new FormActionData(0,
        this.doralData.rentalApplicationsData.TableId,
        new Where(Number(this.selectedRentalRow.id)),
        new Array<FieldListItem>()
      );
      // const recordPackage = new PackageJob(environment.applicationId,
      //   this.doralData.documentsData.DocumentFileId,
      //   this.doralData.documentsData.RelatedApplicationsFieldId,
      //   Number(this.selectedRentalRow.id), true, 0, "Rental Application Attachment");

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }
      // await this.ignatiusService.postPackage(recordPackage).toPromise();
      await this.ignatiusService.putData(recordFAD).toPromise();
      this.rentalApplicationUpdateCompleted('Submitted', null, true);
    } catch (error) {
      this.rentalApplicationUpdateCompleted(null, 'Submitting', false);
    }
  }

  private rentalApplicationUpdateCompleted(msg = '', err = '', success = true) {
    if (success) {
      this.modelConfig.busy = false;
      for (let itrator of this.rentalApplicationList) {
        if (itrator.id === this.selectedRentalRow.id) {
          itrator.status = 'Submitted';
        }
      }
      this.toastr.success(`Rental Application ${msg} successfully`, 'Success');
      this.ngbModal.dismissAll();
    } else {
      this.modelConfig.busy = false;
      this.ngbModal.dismissAll();
      this.toastr.error(`Error in ${err} Rental Application`, 'Error');
    }
  }

  downloadRentalFile(row) {
    // NOT AVAILABLE FOR NOW
  }

  editBusinessRecord(id) {
    this.router.navigate([`businessapplications-edit/${id}`])
  }

  openSubmitBusinessApplicationPopup(row, content) {
    this.selectedBusinessRow = row;
    this.modelConfig = new PopupModel();
    this.modelConfig['type'] = 'business';
    this.modelConfig.title = 'Certification / Certificación  - Submit Business Application';
    this.modelConfig.settings.size = 'lg';
    this.ngbModal.open(content, this.modelConfig.settings);
  }

  submitBusinessApplication() {
    const obj = { ...this.getCertifyObj() };
    //obj['date_of_applicant_submission'] = new Date();
    //obj['submitted_by'] = this.loggedInuserEmail;
    obj['status'] = 'Submitted';
    this.updateBusinessApplication(obj);
  }

  private async updateBusinessApplication(appObject) {
    try {
      this.modelConfig.busy = true;
      const recordFAD = new FormActionData(0,
        this.doralData.businessApplicationsData.TableId,
        new Where(Number(this.selectedBusinessRow.id)),
        new Array<FieldListItem>()
      );
      // const recordPackage = new PackageJob(environment.applicationId,
      //   this.doralData.documentsData.DocumentFileId,
      //   this.doralData.documentsData.RelatedApplicationsFieldId,
      //   Number(this.selectedBusinessRow.id), true, 0, "Business Application Attachment");

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }
      // await this.ignatiusService.postPackage(recordPackage).toPromise();
      await this.ignatiusService.putData(recordFAD).toPromise();
      this.businessApplicationUpdateCompleted('Submitted', null, true);
    } catch (error) {
      this.businessApplicationUpdateCompleted(null, 'Submitting', false);
    }
  }

  private businessApplicationUpdateCompleted(msg = '', err = '', success = true) {
    if (success) {
      this.modelConfig.busy = false;
      for (let itrator of this.businessApplicationList) {
        if (itrator.id === this.selectedBusinessRow.id) {
          itrator.status = 'Submitted';
        }
      }
      this.toastr.success(`Business Application ${msg} successfully`, 'Success');
      this.ngbModal.dismissAll();
    } else {
      this.modelConfig.busy = false;
      this.ngbModal.dismissAll();
      this.toastr.error(`Error in ${err} Business Application`, 'Error');
    }
  }

  // async downloadBusinessFile(row) {
  //   this.spinner.show();
  //   await this.ignatiusService
  //     .getQueryReportObservable(
  //       this.doralData.appData,
  //       {
  //         "ApplicationTableId": this.doralData.documentsData.TableId,
  //         "ConditionGroups": [
  //           {
  //             "Type": "all",
  //             "Conditions": [
  //               {
  //                 "ConditionField": {
  //                   "Id": this.doralData.documentsData.RelatedApplicationsFieldId
  //                 },
  //                 "OperationType": "is equal",
  //                 "Value": Number(row.id)
  //               },
  //               {
  //                 "ConditionField": {
  //                   "Id": this.doralData.documentsData.DocumentTypeId
  //                 },
  //                 "OperationType": "is equal",
  //                 "Value": "Package file"
  //               },
  //               {
  //                 "ConditionField": {
  //                   "Id": this.doralData.documentsData.DocumentFileId
  //                 },
  //                 "OperationType": "start with",
  //                 "Value": "CTCApplication"
  //               }
  //             ]
  //           }
  //         ]
  //       }).subscribe((response) => {
  //         if (response.length === 0) {
  //           this.toastr.warning("PDF is creating.. please wait a few minutes and try again.");
  //           this.spinner.hide();
  //           return;
  //         }
  //         let pdfJob = response.sort((a, b) => b["datecreated"] - a["datecreated"]);
  //         this.ignatiusService.downloadFile(
  //           this.doralData.documentsData.TableId,
  //           pdfJob[0]["id"],
  //           this.doralData.documentsData.DocumentFileId,
  //           pdfJob[0]["document"]
  //         );
  //         this.spinner.hide();
  //       });
  // }

}