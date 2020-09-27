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
    // this.componentData = this.route.snapshot.data['componentData'];
    // this.applicantData = this.componentData[3] as Object[];
    // this.responses = this.componentData[2] as Object[];
    // this.threads = this.componentData[1] as Object[]; 
    // this.apps = this.componentData[0] as Object[];

    // this.applicant = this.applicantData[0] || {
    //   allocation_amount: 0,
    //   total_submitted: 0,
    //   total_approved: 0,
    //   available_balance: 0
    // };

    this.userData = this.storageService.getItem('userData');

    // this.filterApps();
    // this.filterThreads();

    // await this.getPledgeList();
    this.spinner.hide();
  }

  loaderCheck() {
    this.spinner.show()
    setTimeout(() => this.spinner.hide(), 3000)
  }

}