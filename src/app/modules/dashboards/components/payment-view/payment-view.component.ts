import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';
import * as uuid from 'uuid';


/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent implements OnInit {

  recordId: string;
  paymentsEditData: any;
  paymentViewData: any;
  paymentEditDocumentData: Array<any> = [];
  paymentsEditTreasuryReportingContractsData: Array<any> = [];
  expenditureCategoryList: Array<any> = [];

  applicationData: any = {};
  treasuryReportingData: any = {};
  treasuryReportingEditData: Array<any> = [];

  paymentContractsEditData: any = {};
  paymentDirectPaymentsEditData: any = {};
  paymentGrantsEditData: any = {};
  paymentLoansEditData: any = {};
  paymentTransfersEditData: any = {};

  milestonesList: Array<any>;
  documentTypeExpenditures: Array<any>;
  projectsList: Array<any>;
  dfaData = this.projectSpecificService.getProjectSpecificData();
  documents: Array<any> = [];
  deletedDocuments: Array<any> = [];
  documentTypes = {};
  documentExpenditureCategories = {};
  documentTitles = {};
  isCompletedStepThree: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private ignatiusService: IgnatiusService,
    private projectSpecificService: ProjectSpecificService

  ) { }

  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.milestonesList = this.getMilestoneList(componentData[0]);
    this.documentTypeExpenditures = componentData[1];
    this.projectsList = componentData[2];
    this.expenditureCategoryList = componentData[3];
    this.paymentsEditData = (componentData && componentData[4]) ? componentData[4][0] : {};
    this.paymentViewData = this.getProjectViewData(this.paymentsEditData);
    this.treasuryReportingEditData = (componentData && componentData[5]) ? componentData[5] : [];
    this.setTreasuryReportingForms(this.treasuryReportingEditData);
    this.getPaymentEditDocumentData();
    this.getApplicationData(this.paymentsEditData);
    this.getTreasuryReportingData(this.paymentsEditData);
    this.getPaymentEditTreasuryReportingData(this.paymentsEditData);
    this.spinner.hide();
  }


  getProjectViewData(editData) {
    let obj = editData;
    obj['project_name'] = this.projectsList
      .filter(iterator => iterator.id === editData.related_projects)
      .map(iterator => iterator.application_title)[0]

    return obj;
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

  loadDocumentsForm(event) {
    let count = Number(event.target.value);

    if (count === 0) {
      this.isCompletedStepThree = true;
      this.documents.splice(0, this.documents.length);
    }

    if (!count) return;

    this.documents.splice(0, this.documents.length);

    for (let i = 0; i < count; i++) {
      let obj = {};
      let tempId = uuid.v4();
      obj['tempId'] = tempId;
      obj[`document_${tempId}`] = "";
      obj[`fileName_${tempId}`] = "";
      obj[`documentTitle_${tempId}`] = "";
      obj[`documentExpenditureCategory_${tempId}`] = "";
      this.documents.push(obj);

      this.documentTypes[tempId] = "";
      this.documentExpenditureCategories[tempId] = "";
    }

  }

  downloadFile(file: any) {
    this.ignatiusService.downloadFile(
      this.dfaData.documentsData.TableId,
      file["id"],
      this.dfaData.documentsData.DocumentFileId,
      file["document"]
    );
  }

  async getApplicationData(paymentEditData) {
    try {
      if (!this.recordId) return;

      this.spinner.show();
      let applicationData = await this.ignatiusService.getTargetTableObservable(
        this.dfaData.appData,
        String(paymentEditData.related_applications),
        this.dfaData.applicationsData.TableId as number,
        this.dfaData.applicationsData.RecordIdFieldId as number
      ).toPromise();

      this.applicationData = (applicationData.length > 0) ? applicationData[0] : {};

      this.spinner.hide();
    } catch (error) {
      this.spinner.hide()
      this.toastr.error('Error in fetching applicationdata', "Error")
    }
  }


  async getTreasuryReportingData(paymentEditData) {
    try {
      if (!this.recordId) return;

      this.spinner.show();
      let treasuryReportingData = await this.ignatiusService.getTargetTableObservable(
        this.dfaData.appData,
        String(paymentEditData.recordId),
        this.dfaData.treasuryReportingData.TableId as number,
        this.dfaData.treasuryReportingData.RecordIdFieldId as number
      ).toPromise();

      this.treasuryReportingData = (treasuryReportingData.length > 0) ? treasuryReportingData[0] : {};
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide()
      this.toastr.error('Error in fetching treasuryReportingData', "Error")
    }
  }

  private getMilestoneList(data): Array<any> {

    if (data.length === 0) return [];
    return data.sort((a, b) => {
      return (Number(a.value.split('%')[0]) > Number(b.value.split('%')[0])) ? 1 : -1
    })
  }

  private getPaymentEditDocumentData() {
    if (!this.recordId) return [];

    this.ignatiusService.getTargetTableObservable(
      this.dfaData.appData,
      this.recordId,
      this.dfaData.documentsData.TableId,
      this.dfaData.documentsData.RelatedPaymentRequestsFieldId as number
    ).subscribe((result): any => {
      this.paymentEditDocumentData = result.filter((elem: any) => elem.document_type === 'Payment Request Attachment')
    })
  }

  private getPaymentEditTreasuryReportingData(paymentsEditData) {
    this.ignatiusService.getTargetTableObservable(
      this.dfaData.appData,
      paymentsEditData.related_applications,
      this.dfaData.treasuryReportingData.TableId,
      this.dfaData.treasuryReportingData.RelatedPaymentRequestsFieldId as number
    ).subscribe((result): any => {
      this.paymentsEditTreasuryReportingContractsData = result.filter((elem: any) => elem.type === 'Contracts')
    })
  }


  //=============================== Treasury Reporting start ===============================>

  contractsFormData: Array<any> = [];
  contractsFromExpenditureType: any = {};
  contractsFromPayeeName: any = {};
  contractsFromPayeeIdentifyingNumber: any = {};
  contractsFromItemDate: any = {};
  contractsFromItemAmount: any = {};
  contractsFromExpenditureCategory: any = {};
  contractsFromItemNumber: any = {};
  contractsFromItemDescription = {};
  contractsFromMiscInfo: any = {};

  grantsFormData: Array<any> = [];
  grantsFromExpenditureType: any = {};
  grantsFromPayeeName: any = {};
  grantsFromPayeeIdentifyingNumber: any = {};
  grantsFromItemDate: any = {};
  grantsFromItemAmount: any = {};
  grantsFromExpenditureCategory: any = {};
  grantsFromItemNumber: any = {};
  grantsFromItemDescription = {};
  grantsFromMiscInfo: any = {};

  loansFormData: Array<any> = [];
  loansFromExpenditureType: any = {};
  loansFromPayeeName: any = {};
  loansFromPayeeIdentifyingNumber: any = {};
  loansFromItemDate: any = {};
  loansFromItemAmount: any = {};
  loansFromExpenditureCategory: any = {};
  loansFromItemNumber: any = {};
  loansFromItemDescription = {};
  loansFromPopDate = {};

  transfersFormData: Array<any> = [];
  transfersFromExpenditureType: any = {};
  transfersFromPayeeName: any = {};
  transfersFromPayeeIdentifyingNumber: any = {};
  transfersFromItemDate: any = {};
  transfersFromItemAmount: any = {};
  transfersFromExpenditureCategory: any = {};
  transfersFromItemDescription = {};

  directPaymentsFormData: Array<any> = [];
  directPaymentsFromExpenditureType: any = {};
  directPaymentsFromPayeeName: any = {};
  directPaymentsFromPayeeIdentifyingNumber: any = {};
  directPaymentsFromItemDate: any = {};
  directPaymentsFromItemAmount: any = {};
  directPaymentsFromExpenditureCategory: any = {};


  addPaymentFormRow(type: string): void {

    let obj = {};
    let tempId = uuid.v4();

    obj[`id`] = null;
    obj[`tempId`] = tempId;
    obj[`ExpenditureType_${tempId}`] = type;
    obj[`PayeeName_${tempId}`] = "";
    obj[`PayeeIdentifyingNumber_${tempId}`] = "";
    obj[`ItemDate_${tempId}`] = "";
    obj[`ItemAmount_${tempId}`] = "";
    obj[`ExpenditureCategory_${tempId}`] = "";


    switch (type) {

      case 'Contracts':
        this.contractsFromExpenditureType[tempId] = type;
        this.contractsFromPayeeName[tempId] = "";
        this.contractsFromPayeeIdentifyingNumber[tempId] = "";
        this.contractsFromItemDate[tempId] = "";
        this.contractsFromItemAmount[tempId] = "";
        this.contractsFromExpenditureCategory[tempId] = "";
        this.contractsFromItemNumber[tempId] = "";
        this.contractsFromItemDescription[tempId] = "";
        this.contractsFromMiscInfo[tempId] = "";
        this.contractsFormData.push(obj);
        break;

      case 'Grants':
        this.grantsFromExpenditureType[tempId] = type;
        this.grantsFromPayeeName[tempId] = "";
        this.grantsFromPayeeIdentifyingNumber[tempId] = "";
        this.grantsFromItemDate[tempId] = "";
        this.grantsFromItemAmount[tempId] = "";
        this.grantsFromExpenditureCategory[tempId] = "";
        this.grantsFormData.push(obj);
        break;

      case 'Loans':
        this.loansFromExpenditureType[tempId] = type;
        this.loansFromPayeeName[tempId] = "";
        this.loansFromPayeeIdentifyingNumber[tempId] = "";
        this.loansFromItemDate[tempId] = "";
        this.loansFromItemAmount[tempId] = "";
        this.loansFromExpenditureCategory[tempId] = "";
        this.loansFormData.push(obj);
        break;

      case 'Transfers':
        this.transfersFromExpenditureType[tempId] = type;
        this.transfersFromPayeeName[tempId] = "";
        this.transfersFromPayeeIdentifyingNumber[tempId] = "";
        this.transfersFromItemDate[tempId] = "";
        this.transfersFromItemAmount[tempId] = "";
        this.transfersFromExpenditureCategory[tempId] = "";
        this.transfersFormData.push(obj);
        break;

      case 'Direct Payments':
        this.directPaymentsFromExpenditureType[tempId] = type;
        this.directPaymentsFromPayeeName[tempId] = "";
        this.directPaymentsFromPayeeIdentifyingNumber[tempId] = "";
        this.directPaymentsFromItemDate[tempId] = "";
        this.directPaymentsFromItemAmount[tempId] = "";
        this.directPaymentsFromExpenditureCategory[tempId] = "";
        this.directPaymentsFormData.push(obj);
        break;

      default:
        break;
    }
  }

  setTreasuryReportingForms(trData) {
    if (trData.length === 0) return;

    for (const iterator of trData) {

      let obj = {};
      let tempId = uuid.v4();

      obj[`id`] = iterator.id;
      obj[`tempId`] = tempId;
      obj[`ExpenditureType_${tempId}`] = iterator.type;
      obj[`PayeeName_${tempId}`] = iterator.identifying_info;
      obj[`PayeeIdentifyingNumber_${tempId}`] = iterator.identifying_info;
      obj[`ItemDate_${tempId}`] = iterator.item_date;
      obj[`ItemAmount_${tempId}`] = iterator.item_amount;
      obj[`ExpenditureCategory_${tempId}`] = iterator.expenditure_category;

      switch (iterator.type) {
        case 'Contracts':
          this.contractsFromExpenditureType[tempId] = iterator.type;
          this.contractsFromPayeeName[tempId] = iterator.party_name || "";
          this.contractsFromPayeeIdentifyingNumber[tempId] = iterator.identifying_info || "";
          this.contractsFromItemDate[tempId] = iterator.item_date || "";
          this.contractsFromItemAmount[tempId] = iterator.item_amount || "";
          this.contractsFromExpenditureCategory[tempId] = iterator.expenditure_category || "";
          this.contractsFromItemNumber[tempId] = iterator.item_number || "";
          this.contractsFromItemDescription[tempId] = iterator.item_description || "";
          this.contractsFromMiscInfo[tempId] = iterator.misc_info || "";
          this.contractsFormData.push(obj);
          break;

        case 'Grants':
          this.grantsFromExpenditureType[tempId] = iterator.type;
          this.grantsFromPayeeName[tempId] = iterator.party_name || "";
          this.grantsFromPayeeIdentifyingNumber[tempId] = iterator.identifying_info || "";
          this.grantsFromItemDate[tempId] = iterator.item_date || "";
          this.grantsFromItemAmount[tempId] = iterator.item_amount || "";
          this.grantsFromExpenditureCategory[tempId] = iterator.expenditure_category || "";
          this.grantsFromItemNumber[tempId] = iterator.item_number || "";
          this.grantsFromItemDescription[tempId] = iterator.item_description || "";
          this.grantsFromMiscInfo[tempId] = iterator.misc_info || "";
          this.grantsFormData.push(obj);
          break;

        case 'Loans':
          this.loansFromExpenditureType[tempId] = iterator.type;
          this.loansFromPayeeName[tempId] = iterator.party_name || "";
          this.loansFromPayeeIdentifyingNumber[tempId] = iterator.identifying_info || "";
          this.loansFromItemDate[tempId] = iterator.item_date || "";
          this.loansFromItemAmount[tempId] = iterator.item_amount || "";
          this.loansFromExpenditureCategory[tempId] = iterator.expenditure_category || "";
          this.loansFromItemNumber[tempId] = iterator.item_number || "";
          this.loansFromItemDescription[tempId] = iterator.item_description || "";
          this.loansFromPopDate[tempId] = iterator.period_of_performance_end_date || "";
          this.loansFormData.push(obj);
          break;

        case 'Transfers':
          this.transfersFromExpenditureType[tempId] = iterator.type;
          this.transfersFromPayeeName[tempId] = iterator.party_name || "";
          this.transfersFromPayeeIdentifyingNumber[tempId] = iterator.identifying_info || "";
          this.transfersFromItemDate[tempId] = iterator.item_date || "";
          this.transfersFromItemAmount[tempId] = iterator.item_amount || "";
          this.transfersFromExpenditureCategory[tempId] = iterator.expenditure_category || "";
          this.transfersFromItemDescription[tempId] = iterator.item_description || "";
          this.transfersFormData.push(obj);
          break;

        case 'Direct Payments':
          this.directPaymentsFromExpenditureType[tempId] = iterator.type;
          this.directPaymentsFromPayeeName[tempId] = iterator.party_name || "";
          this.directPaymentsFromPayeeIdentifyingNumber[tempId] = iterator.identifying_info || "";
          this.directPaymentsFromItemDate[tempId] = iterator.item_date || "";
          this.directPaymentsFromItemAmount[tempId] = iterator.item_amount || "";
          this.directPaymentsFromExpenditureCategory[tempId] = iterator.expenditure_category || "";
          this.directPaymentsFormData.push(obj);
          break;

        default:
          break;
      }
    }
  }

  //=============================== Treasury Reporting end ===============================>



}


