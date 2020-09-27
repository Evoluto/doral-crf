import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { PopupModel } from 'src/app/modules/dashboards/models/popup';
import { FormActionData, FieldListItem } from 'src/app/models/form-action-data';
import { StorageService } from 'src/app/services/storage.service';

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

  doralData: any = []
  pledgeList: any = []
  modelConfig: PopupModel;
  pledgeForm: FormGroup;

  dtOptions: DataTables.Settings = {
    paging: false,
   // order: [[ 3, "desc" ]],
    searching: false,
    pagingType: 'full_numbers',
    pageLength: 10
  };
  threadDtOptions: DataTables.Settings = {
    paging: false,
   // order: [[ 2, "desc" ]],
    searching: false,
    pagingType: 'full_numbers',
    pageLength: 10
  };
  componentData: Object[];
  responses: any;
  threads: any;
  apps: any;
  applicantData: any;
  applicant: any;
  userData: any;

  async ngOnInit() {
    this.componentData = this.route.snapshot.data['componentData'];
    this.applicantData = this.componentData[3] as Object[];
    this.responses = this.componentData[2] as Object[];
    this.threads = this.componentData[1] as Object[]; 
    this.apps = this.componentData[0] as Object[];

    this.applicant = this.applicantData[0] || {
      allocation_amount: 0,
      total_submitted: 0,
      total_approved: 0,
      available_balance: 0
    };

    this.userData = this.storageService.getItem('userData');

    this.filterApps();
    this.filterThreads();

    // await this.getPledgeList();
    this.spinner.hide();
  }

  filterApps() {
    const dateToCompare = new Date();
    dateToCompare.setDate(dateToCompare.getDate() - 5);

    this.apps = this.apps
      .sort((a, b) => b.datemodified - a.datemodified)
      .filter(app => {
        const ast = +app.date_of_applicant_submission_time;
        const rst = +app.date_of_dfa_review_start_time;
        const at = +app.date_of_dfa_approval_time;

        if ((ast > 0 && ast <= 5) || (rst > 0 && rst <= 5) || (at> 0 && at <= 5)) return true;
        return false;
      });
  }

  filterThreads() {
    this.threads = this.threads
      .sort((a, b) => b.datecreated - a.datecreated)
      .filter(thread => {
        return this.hasNewReply(thread);
      });
  }

  appRowClick(row){
    if(row.status == "Open"){
      this.router.navigate([`applications-edit/${row.id}`])
    }
  }
  comRowClick(row){
    if(row.status == "Open"){
      this.router.navigate([`communications/${row.id}`])
    }
  }

  loaderCheck() {
    this.spinner.show()
    setTimeout(() => this.spinner.hide(), 3000)
  }

  openAddPledgePopup(content) {
    this.setupForm();
    this.modelConfig = new PopupModel();
    this.modelConfig.title = 'Add Pledge';
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  onPledgeFormSubmit() {
    if (this.pledgeForm.valid) {
      //save or update check
      this.addPledge()
    } else {
      this.validateAllFormFields(this.pledgeForm);
    }
  }


  private async getPledgeList() {
    try {
      this.pledgeList = await this.ignatiusService.getQueryReportObservable(
        this.doralData.appData,
        { "ApplicationTableId": this.doralData.pledgesData.TableId }
      ).toPromise()
    } catch (error) {
      throw error;
    }
  }

  private setupForm() {
    this.pledgeForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required])
    })
  }

  private validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }

  private async addPledge() {
    try {
      this.modelConfig.busy = true;
      const recordFAD = new FormActionData(0,
        this.doralData.pledgesData.TableId,
        null,
        new Array<FieldListItem>()
      );

      const formValues = this.getAddPledgeFormValues(this.pledgeForm.value);

      for (let key in formValues) {
        recordFAD.fieldsList.push(new FieldListItem(key, formValues[key], ""))
      }
      await this.ignatiusService.postData(recordFAD).toPromise();
      await this.getPledgeList();
      this.pledgeFormActionCompleted(true);

    } catch (error) {
      this.pledgeFormActionCompleted(false);
    }
  }

  private pledgeFormActionCompleted(success = true) {
    const msg = 'added' //Make it conditonally for update
    const err = 'adding' //Make it conditonally for update

    if (success) {
      this.toastr.success(`Pledged ${msg} successfully`, 'Success');
    } else {
      this.toastr.error(`Error in ${err}`, 'Error');
    }
    this.modelConfig.busy = false;
    this.ngbModal.dismissAll()
  }

  private getAddPledgeFormValues(formValues) {
    const obj = {};
    obj['first_name'] = formValues['firstName'];
    obj['last_name'] = formValues['lastName'];
    return obj;
  }

  hasAttachment(thread) {
    const responses = this.componentData[2] as any[];
    const responseDocs = responses
      .filter(res => res.related_comm_threads == thread.id)
      .map(res => +res.number_of_response_documents)
      .filter(val => val > 0);
    return +thread.number_of_thread_documents || responseDocs.length;
  }

  hasNewReply(thread) {
    const responses = this.componentData[2] as any[];
    const unreadResponseReplies = responses
      .filter(res => {
        if (
          res.related_comm_threads == thread.id &&
          res.read == 'False' &&
          res.createdby != this.userData.userName
        ) return true;
        return false;
      });
    return (thread.read == 'False' && thread.createdby != this.userData.userName) || unreadResponseReplies.length;
  }
}