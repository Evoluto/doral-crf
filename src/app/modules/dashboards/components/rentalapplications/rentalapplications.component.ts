import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-rentalapplications',
  templateUrl: './rentalapplications.component.html',
  styleUrls: ['./rentalapplications.component.css']
})
export class RentalapplicationsComponent implements OnInit {

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
  rentalApplicationList: Array<any> = [];
  rows: Array<any> = [];

  statusList: Array<any> = [];
  reviewStatusList: Array<any> = [];
  reviewIssuesList: Array<any> = [];

  selectedStatusList: Array<any> = [];
  selectedReviewStatusList: Array<any> = [];
  selectedReviewIssuesList: Array<any> = [];

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [],
    columnDefs: [{
      targets: [0],
      orderable: false
    }]
  };
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtTrigger = new Subject();


  ngOnInit() {
    const componentData = this.route.snapshot.data['componentData'];
    this.rentalApplicationList = componentData[0];
    this.rows = this.rentalApplicationList;
    this.setupFilters();
  }

  ngAfterViewInit(){
    this.dtTrigger.next();
    this.spinner.hide();
  }

  viewRentalRecord(id) {
    this.router.navigate([`rentalapplications-view/${id}`])
  }

  openFilter(content) {
    this.modelConfig = new PopupModel();
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  setupFilters() {
    for (const iterator of this.rentalApplicationList) {

      if (iterator.status && !this.statusList.includes(iterator.status)) {
        this.statusList.push(iterator.status)
      }

      if (iterator.review_status && !this.reviewStatusList.includes(iterator.review_status)) {
        this.reviewStatusList.push(iterator.review_status)
      }

      if (iterator.review_issue_reason && !this.reviewIssuesList.includes(iterator.review_issue_reason)) {
        this.reviewIssuesList.push(iterator.review_issue_reason)
      }

    }
  }

  applyFilter() {

    this.spinner.show()

    const temp = this.rentalApplicationList.filter(iterator => {
      const condition = (
        (
          this.selectedStatusList.length === 0 ||
          this.selectedStatusList.includes(iterator.status)
        ) &&
        (
          this.selectedReviewStatusList.length === 0 ||
          this.selectedReviewStatusList.includes(iterator.review_status)
        ) &&
        (
          this.selectedReviewIssuesList.length === 0 ||
          this.selectedReviewIssuesList.includes(iterator.review_issue_reason)
        )
      )
      return condition;
    });

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger.next();
        this.ngbModal.dismissAll()
        this.spinner.hide();
      }, 500);
    });
    this.rows = [...temp];
  }

}









