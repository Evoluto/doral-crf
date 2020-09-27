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
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

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

  dfaData: any = []
  applicationList: any = []
  rows: any = []
  modelConfig: PopupModel;
  loggedInuserEmail: string;
  applicationForm: FormGroup;

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
    this.dfaData = this.projectSpecificService.getProjectSpecificData();
    this.loggedInuserEmail = this.storageService.getItem('userData') &&
      this.storageService.getItem('userData')['userName'];
    this.dropdownSettings = new MultiselectModel();
    await this.getApplicationList();
    this.setupFilters(); // Don't change order

    this.spinner.hide();
  }

  private async getApplicationList() {
    try {
      this.applicationList = await this.ignatiusService.getQueryReportObservable(
        this.dfaData.appData,
        { "ReportId": this.dfaData.applicationsData.ApplicationListReportId }
      ).toPromise();

      this.rows = [...this.applicationList];
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
      let filteredRows = this.applicationList.filter(app => this.selectedStatus.includes(app.status));
      this.rows = filteredRows;  
    } else {
      this.rows = this.applicationList;
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
    this.statusList = [...new Set(this.applicationList.map(app => app.status))].filter(status => status);
  }

  editRecord(id) {
    this.router.navigate([`applications-edit/${id}`])
  }

  openSubmitApplicationPopup(row, content) {
    this.selectedRow = row;
    this.modelConfig = new PopupModel();
    this.modelConfig.title = 'Submit Application';
    this.modelConfig.settings.size = 'sm';
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  submitApplication() {
    const obj = {};
    obj['date_of_applicant_submission'] = new Date();
    obj['submitted_by'] = this.loggedInuserEmail;
    obj['status'] = 'Submitted';
    this.updateApplication(obj);
  }

  private async updateApplication(appObject) {
    try {
      this.modelConfig.busy = true;
      const recordFAD = new FormActionData(0,
        this.dfaData.applicationsData.TableId,
        new Where(Number(this.selectedRow.id)),
        new Array<FieldListItem>()
      );
      const recordPackage = new PackageJob(environment.applicationId,
        this.dfaData.documentsData.DocumentFileId,
        this.dfaData.documentsData.RelatedApplicationsFieldId,
        Number(this.selectedRow.id), true, 0, "Application Attachment");

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }
      await this.ignatiusService.postPackage(recordPackage).toPromise();
      await this.ignatiusService.putData(recordFAD).toPromise();
      this.applicationUpdateCompleted('Submitted', null, true);
    } catch (error) {
      this.applicationUpdateCompleted(null, 'Submitting', false);
    }
  }

  private applicationUpdateCompleted(msg = '', err = '', success = true) {
    if (success) {
      this.modelConfig.busy = false;
      for (let itrator of this.rows) {
        if (itrator.id === this.selectedRow.id) {
          itrator.status = 'Submitted';
        }
      }
      this.toastr.success(`Application ${msg} successfully`, 'Success');
      this.ngbModal.dismissAll();
    } else {
      this.modelConfig.busy = false;
      this.ngbModal.dismissAll();
      this.toastr.error(`Error in ${err} Application`, 'Error');
    }
  }

  async downloadFile(file: any) {
    this.spinner.show();
    await this.ignatiusService
      .getQueryReportObservable(
        this.dfaData.appData,
        {
          "ApplicationTableId": this.dfaData.documentsData.TableId,
          "ConditionGroups": [
            {
              "Type": "all",
              "Conditions": [
                {
                  "ConditionField": {
                    "Id": this.dfaData.documentsData.RelatedApplicationsFieldId
                  },
                  "OperationType": "is equal",
                  "Value": Number(file.id)
                },
                {
                  "ConditionField": {
                    "Id": this.dfaData.documentsData.DocumentTypeId
                  },
                  "OperationType": "is equal",
                  "Value": "Package file"
                },
                {
                  "ConditionField": {
                    "Id": this.dfaData.documentsData.DocumentFileId
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
            this.dfaData.documentsData.TableId,
            pdfJob[0]["id"],
            this.dfaData.documentsData.DocumentFileId,
            pdfJob[0]["document"]
          );
          this.spinner.hide();
        });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  async createPaymentRequest(id) {
    this.ignatiusService.getTargetTableObservable(
      this.dfaData.appData,
      id,
      this.dfaData.projectsData.TableId as number,
      this.dfaData.projectsData.RelatedApplicationsId as number
    ).subscribe(res => {
      const project: any = res[0];
      this.router.navigate(['/payments/add'], { queryParams: { project: project.id } });
    })
  }
}
