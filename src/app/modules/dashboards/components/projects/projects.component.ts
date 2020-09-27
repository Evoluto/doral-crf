import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private projectSpecificService: ProjectSpecificService,
    private ignatiusService: IgnatiusService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
  ) { }

  dfaData: any = []
  projectList: any = []
  rows: any = []
  modelConfig: PopupModel;
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

  async ngOnInit() {
    this.spinner.show();
    this.dfaData = this.projectSpecificService.getProjectSpecificData();
    this.dropdownSettings = new MultiselectModel();
    await this.getProjectList();
    // this.setupFilters(); // Don't change order

    this.spinner.hide();
  }

  private async getProjectList() {
    try {
      this.projectList = await this.ignatiusService.getQueryReportObservable(
        this.dfaData.appData,
        { "ApplicationTableId": this.dfaData.projectsData.TableId }
      ).toPromise();

      this.rows = [...this.projectList];
      this.dtTrigger.next();
    } catch (error) {
      this.toastr.error('Error in loading applications', 'Error')
    }
  }

  // openFilter(content) {
  //   this.modelConfig = new PopupModel();
  //   this.ngbModal.open(content, this.modelConfig.settings)
  // }

  // applyFilter(): void {
  //   let temp = new Array<any>();

  //   for (let row of this.projectList) {
  //     const filterCondition = (
  //       this.selectedStatus.includes(row["status"]) ||
  //       this.selectedStatus.length === 0
  //     );
  //     if (filterCondition) temp.push(row);
  //   }
  //   this.rows = temp;
  //   this.ngbModal.dismissAll()
  // }

  // private setupFilters(): void {
  //   if (!this.projectList || this.projectList.length === 0) {
  //     this.statusList = []
  //     return;
  //   }
  //   for (let value of this.projectList) {
  //     if (!this.statusList.includes(value.status)) this.statusList.push(value.status);
  //   }
  // }

  viewRecord(recordId: any, content: any) {
    this.router.navigate([`../../projects/view/${recordId}`])
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
