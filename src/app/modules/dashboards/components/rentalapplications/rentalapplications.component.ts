import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { PopupModel } from 'src/app/modules/dashboards/models/popup';
import { MultiselectModel } from 'src/app/modules/dashboards/models/multiselect';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { FormActionData, Where, FieldListItem } from 'src/app/models/form-action-data';
import { PackageJob } from 'src/app/models/package';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-rentalapplications',
  templateUrl: './rentalapplications.component.html',
  styleUrls: ['./rentalapplications.component.css']
})
export class RentalApplicationsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private projectSpecificService: ProjectSpecificService,
    private ignatiusService: IgnatiusService,
    private storageService: StorageService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
  ) { }

  doralData: any = []
  rentalApplicationList: any = []
  rows: any = []
  modelConfig: PopupModel;
  loggedInuserEmail: string;
  rentalApplicationForm: FormGroup;

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [],
    columnDefs: [{
      targets: [0],
      orderable: false
    }]
  };
  dtTrigger = new Subject();
  selectedRow: any;

  statusList: Array<any> = [];
  selectedStatus: Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  async ngOnInit() {
    this.spinner.show();
    this.doralData = this.projectSpecificService.getProjectSpecificData();
    this.loggedInuserEmail = this.storageService.getItem('userData') &&
      this.storageService.getItem('userData')['userName'];
    this.dropdownSettings = new MultiselectModel();
    await this.getRentalApplicationList();
    this.setupFilters(); // Don't change order

    this.spinner.hide();
  }

  private async getRentalApplicationList() {
    try {
      this.rentalApplicationList = await this.ignatiusService.getQueryReportObservable(
        this.doralData.appData,
        { "ReportId": this.doralData.rentalApplicationsData.RentalApplicationListReportId }
      ).toPromise();

      this.rows = [...this.rentalApplicationList];
      this.dtTrigger.next();
    } catch (error) {
      this.toastr.error('Error in loading applications', 'Error')
    }
  }

  openFilter(content) {
    this.modelConfig = new PopupModel();
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  applyFilter(): void {
    this.spinner.show();
    if(this.selectedStatus.length){
      let filteredRows = this.rentalApplicationList.filter(app => this.selectedStatus.includes(app.status));
      this.rows = filteredRows;  
    } else {
      this.rows = this.rentalApplicationList;
    }

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    });   
    this.ngbModal.dismissAll()
  }

  private setupFilters(): void {
    this.statusList = [...new Set(this.rentalApplicationList.map(app => app.status))].filter(status => status);
  }

  editRecord(id) {
    this.router.navigate([`rentalapplications-edit/${id}`])
  }

  openSubmitRentalApplicationPopup(row, content) {
    this.selectedRow = row;
    this.modelConfig = new PopupModel();
    this.modelConfig.title = 'Submit Rental Application';
    this.modelConfig.settings.size = 'sm';
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  submitRentalApplication() {
    const obj = {};
    //obj['date_of_applicant_submission'] = new Date();
    //obj['submitted_by'] = this.loggedInuserEmail;
    //obj['status'] = 'Submitted';
    //this.updateRentalApplication(obj);
  }

  private async updateRentalApplication(appObject) {
    try {
      this.modelConfig.busy = true;
      const recordFAD = new FormActionData(0,
        this.doralData.rentalApplicationsData.TableId,
        new Where(Number(this.selectedRow.id)),
        new Array<FieldListItem>()
      );
      const recordPackage = new PackageJob(environment.applicationId,
        this.doralData.documentsData.DocumentFileId,
        this.doralData.documentsData.RelatedApplicationsFieldId,
        Number(this.selectedRow.id), true, 0, "Rental Application Attachment");

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }
      await this.ignatiusService.postPackage(recordPackage).toPromise();
      await this.ignatiusService.putData(recordFAD).toPromise();
      this.rentalApplicationUpdateCompleted('Submitted', null, true);
    } catch (error) {
      this.rentalApplicationUpdateCompleted(null, 'Submitting', false);
    }
  }

  private rentalApplicationUpdateCompleted(msg = '', err = '', success = true) {
    if (success) {
      this.modelConfig.busy = false;
      for (let itrator of this.rows) {
        if (itrator.id === this.selectedRow.id) {
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

  async downloadFile(file: any) {
    this.spinner.show();
    await this.ignatiusService
      .getQueryReportObservable(
        this.doralData.appData,
        {
          "ApplicationTableId": this.doralData.documentsData.TableId,
          "ConditionGroups": [
            {
              "Type": "all",
              "Conditions": [
                {
                  "ConditionField": {
                    "Id": this.doralData.documentsData.RelatedApplicationsFieldId
                  },
                  "OperationType": "is equal",
                  "Value": Number(file.id)
                },
                {
                  "ConditionField": {
                    "Id": this.doralData.documentsData.DocumentTypeId
                  },
                  "OperationType": "is equal",
                  "Value": "Package file"
                },
                {
                  "ConditionField": {
                    "Id": this.doralData.documentsData.DocumentFileId
                  },
                  "OperationType": "start with",
                  "Value": "CTCApplication"
                }
              ]
            }
          ]
        }).subscribe((response) => {
          if (response.length === 0) {
            this.toastr.warning("PDF is creating.. please wait a few minutes and try again.");
            this.spinner.hide();
            return;
          }
          let pdfJob = response.sort((a, b) => b["datecreated"] - a["datecreated"]);
          this.ignatiusService.downloadFile(
            this.doralData.documentsData.TableId,
            pdfJob[0]["id"],
            this.doralData.documentsData.DocumentFileId,
            pdfJob[0]["document"]
          );
          this.spinner.hide();
        });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // async createPaymentRequest(id) {
  //   this.ignatiusService.getTargetTableObservable(
  //     this.doralData.appData,
  //     id,
  //     this.doralData.projectsData.TableId as number,
  //     this.doralData.projectsData.RelatedApplicationsId as number
  //   ).subscribe(res => {
  //     const project: any = res[0];
  //     this.router.navigate(['/payments/add'], { queryParams: { project: project.id } });
  //   })
  // }
}
