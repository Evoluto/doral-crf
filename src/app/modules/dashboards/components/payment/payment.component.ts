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
import { StorageService } from 'src/app/services/storage.service';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private projectSpecificService: ProjectSpecificService,
    private ignatiusService: IgnatiusService,
    private storageService:StorageService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
  ) { }

  componentData: Array<any> = [];
  paymentList: Array<any> = [];
  dfaData: any = []
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
  // dtTrigger = new Subject();
  selectedRow: any;
;
  dropdownSettings: IDropdownSettings = {};

  ngOnInit() {
    this.dfaData = this.projectSpecificService.getProjectSpecificData();
    this.componentData = this.route.snapshot.data['componentData'];
    this.paymentList = this.componentData[0];
    this.rows = [...this.paymentList];
    this.dropdownSettings = new MultiselectModel();
    // this.dtTrigger.next();
    this.spinner.hide();
  }

  editRecord(id) {
    this.router.navigate([`payments/edit/${id}`])
  }

  viewPaymentRequest(id) {
    this.router.navigate([`payments/view/${id}`])
  }

  openSubmitPRPopup(row, content) {
    this.selectedRow = row;
    this.modelConfig = new PopupModel();
    this.modelConfig.title = 'Submit Payment Request';
    this.modelConfig.settings.size = 'sm';
    this.ngbModal.open(content, this.modelConfig.settings)
  }

  submitPR() {
    const obj = {};
    obj['status'] = 'Submitted';
    this.updatePaymentRequests(obj);
  }

  private async updatePaymentRequests(appObject) {
    try {
      this.modelConfig.busy = true;
      const recordFAD = new FormActionData(0,
        this.dfaData.paymentRequestData.TableId,
        new Where(Number(this.selectedRow.id)),
        new Array<FieldListItem>()
      );

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }
      
      const todayDate = new Date();
      recordFAD.fieldsList.push(new FieldListItem("date_of_pr_submission", todayDate.toDateString(), ""))

      await this.ignatiusService.putData(recordFAD).toPromise();
      this.paymentUpdateCompleted('Submitted', null, true);
    } catch (error) {
      this.paymentUpdateCompleted(null, 'Submitting', false);

    }
  }

  private paymentUpdateCompleted(msg = '', err = '', success = true) {
    if (success) {
      this.modelConfig.busy = false;
      for (let itrator of this.rows) {
        if (itrator.id === this.selectedRow.id) {
          itrator.status = 'Submitted';
        }
      }
      this.toastr.success(`Payment record ${msg} successfully`, 'Success');
      this.ngbModal.dismissAll();
    } else {
      this.modelConfig.busy = false;
      this.ngbModal.dismissAll();
      this.toastr.error(`Error in ${err} Payment record`, 'Error');
    }
  }

  // ngOnDestroy(): void {
  //   this.dtTrigger.unsubscribe();
  // }

}
