import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage.service';
import { FormActionData, FieldListItem, Where } from 'src/app/models/form-action-data';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { Field } from 'src/app/models/app-data';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MultiselectModel } from 'src/app/modules/dashboards/models/multiselect';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupModel } from 'src/app/modules/dashboards/models/popup';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css']
})
export class CommunicationsComponent implements OnInit, OnDestroy, AfterViewInit {  

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private projectSpecificService: ProjectSpecificService,
    private ignatiusService: IgnatiusService,
    private storageService: StorageService,
    private ngbModal: NgbModal
  ) { }

  componentData: Object[];
  threads: any;
  rows: any;
  dfaData: any = []

  dtOptions: DataTables.Settings = {
    retrieve: true,
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [],
    columnDefs: [{
      targets: [0],
      orderable: false
    }]
  };
  
  dtTrigger = new Subject();
  selectedType: Array<any> = [];
  modelConfig: PopupModel;
  threadTypes = [{ value: 'Ticket' }, { value: 'RFI' }];

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  async rowClick(row) {
    this.router.navigate([`communications/${row.id}`])
  }

  ngOnInit() {
    this.componentData = this.route.snapshot.data['componentData'];
    this.threads = this.getThreadsData(this.componentData);
    this.rows = this.getThreadsData(this.componentData);
    this.dfaData = this.projectSpecificService.getProjectSpecificData();
    this.spinner.hide();
  }

  private getThreadsData(data) {
    const userData = this.storageService.getItem('userData');
    const threadData = data[0] as any || [];
    const resps = data[1] as any || [];

    for (const iterator of threadData) {
      threadData.new = false;
      for (const innerIterator of resps) {
        const condition = (
          innerIterator.related_comm_threads === iterator.id &&
          innerIterator.read === "False" &&
          innerIterator.createdby != userData.userName
        );
        if (!condition) continue;
        iterator.new = true;
      }
    }
    return threadData;
  }

  hasAttachment(thread) {
    const responses = this.componentData[1] as any[];
    const responseDocs = responses
                .filter(res => res.related_comm_threads == thread.id)
                .map(res => +res.number_of_response_documents)
                .filter(val => val > 0);
    return +thread.number_of_thread_documents || responseDocs.length;
  }

  openFilter(content) {
    this.modelConfig = new PopupModel();
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  applyFilter(): void {
    this.spinner.show();
    if(this.selectedType.length){
      let filteredRows = this.threads.filter(thread => this.selectedType.map(type => type.value).includes(thread.type));
      this.rows = filteredRows;  
    } else {
      this.rows = this.threads;
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

  dropdownSettings(allowSearch = false) {
    return {
      singleSelection: false,
      idField: 'value',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: allowSearch
    };
  }

}
