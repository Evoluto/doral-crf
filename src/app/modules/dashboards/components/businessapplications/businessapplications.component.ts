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
import { Subject } from 'rxjs';

@Component({
  selector: 'app-businessapplications',
  templateUrl: './businessapplications.component.html',
  styleUrls: ['./businessapplications.component.css']
})
export class BusinessapplicationsComponent implements OnInit {

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

  modelConfig:PopupModel;
  businessApplicationList: Array<any> = [];
  rows: Array<any> = [];

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [],
    columnDefs: [{
      targets: [0],
      orderable: false
    }]
  };
  // dtTrigger = new Subject();


  ngOnInit() {
    const componentData = this.route.snapshot.data['componentData'];
    this.businessApplicationList = componentData[0];
    this.rows = this.businessApplicationList;
    this.spinner.hide()
  }

  viewBusinessRecord(id) {
    this.router.navigate([`businessapplications-view/${id}`])
  }

  openFilter(content) {
    this.modelConfig = new PopupModel();
    this.ngbModal.open(content, this.modelConfig.settings)
  }

}
