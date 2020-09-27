import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/shared/constants';
import { FieldListItem, FormActionData, Where } from 'src/app/models/form-action-data';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';
import * as uuid from 'uuid';
import { forkJoin, Observable } from 'rxjs';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { ExportService } from '../../services';
import { ThrowStmt } from '@angular/compiler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupModel } from 'src/app/modules/dashboards/models/popup';


/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-payment-add',
  templateUrl: './payment-add.component.html',
  styleUrls: ['./payment-add.component.css']
})
export class PaymentAddComponent implements OnInit {

  projectId: string;
  recordId: string;
  paymentsEditData: any;
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
  milestonesInitialList: Array<any>;
  documentTypeExpenditures: Array<any>;
  projectsList: Array<any>;
  selectedProject: any = {};
  dfaData = this.projectSpecificService.getProjectSpecificData();
  documents: Array<any> = [];
  deletedDocuments: Array<any> = [];
  documentTypes = {};
  documentExpenditureCategories = {};
  documentTitles = {};
  isCompletedStepThree: boolean = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  modelConfig: PopupModel;


  paymentReqValidationStatus: boolean = true;
  tresaryReportingDeleteIds: Array<any> = [];

  stepOneFormStatus: boolean = false;
  ContractsFormStatus: boolean = false;
  GrantsFormStatus: boolean = false;
  LoansFormStatus: boolean = false;
  TransfersFormStatus: boolean = false;
  DirectPaymentsFormStatus: boolean = false;

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private ignatiusService: IgnatiusService,
    private storageService: StorageService,
    private projectSpecificService: ProjectSpecificService,
    private exportService: ExportService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['project'];
    });
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.milestonesList = this.getMilestoneList(componentData[0]);
    this.milestonesInitialList = [...this.milestonesList];
    this.documentTypeExpenditures = componentData[1];
    this.projectsList = this.getProjectList(componentData[2]);
    this.expenditureCategoryList = componentData[3];
    this.paymentsEditData = (componentData && componentData[4]) ? componentData[4][0] : {};
    this.treasuryReportingEditData = (componentData && componentData[5]) ? componentData[5] : [];
    this.setTreasuryReportingForms(this.treasuryReportingEditData);
    this.getPaymentEditDocumentData();
    this.getApplicationData(this.paymentsEditData);
    this.getProjectData(this.paymentsEditData);
    this.getTreasuryReportingData(this.paymentsEditData);
    this.getPaymentEditTreasuryReportingData(this.paymentsEditData);
    this.setupForm();
    this.spinner.hide();
  }

  private setupForm() {
    this.setupFirstForm();
    this.setupSecondForm();
    this.setupFourthForm();
  }

  private setupFirstForm() {
    const NumberPattern = /^\d{1,8}(\.\d{1,2})?$/;
    const relatedProjects = (this.paymentsEditData.related_projects)
      ? { value: this.paymentsEditData.related_projects, disabled: true }
      : !this.recordId && this.projectId ? this.projectId : '';

    if (this.projectId != "")
    {
      this.onLoadProjectInfo(this.projectId);
    }
    const milestone = (this.paymentsEditData.milestone)
      ? { value: this.paymentsEditData.milestone, disabled: true }
      : ""

    this.firstFormGroup = new FormGroup({

      relatedProjects: new FormControl(relatedProjects, Validators.required),
      milestone: new FormControl(milestone, Validators.required),
      planAdminExpPRAmount: new FormControl(
        this.paymentsEditData.plan_admin_exp_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planBudgetedDivertedPRAmount: new FormControl(
        this.paymentsEditData.plan_budgeted_diverted_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      // planTestingPRAmount: new FormControl(
      //   this.paymentsEditData.plan_testing_pr_amount || '0',
      //   Validators.pattern(NumberPattern),
      // ),

      // planEconomicSupportPRAmount: new FormControl(
      //   this.paymentsEditData.plan_economic_support_pr_amount || '0',
      //   Validators.pattern(NumberPattern)
      // ),

      // planIssuanceOfTaxPRAmount: new FormControl(
      //   this.paymentsEditData.plan_issuance_of_tax_pr_amount || '0',
      //   Validators.pattern(NumberPattern)
      // ),

      planDistanceLearningPRAmount: new FormControl(
        this.paymentsEditData.plan_distance_learning_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planFoodPRAmount: new FormControl(
        this.paymentsEditData.plan_food_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planHousingPRAmount: new FormControl(
        this.paymentsEditData.plan_housing_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planTeleworkPRAmount: new FormControl(
        this.paymentsEditData.plan_telework_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planMedicalPRAmount: new FormControl(
        this.paymentsEditData.plan_medical_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      // planNursingHomePRAmount: new FormControl(
      //   this.paymentsEditData.plan_nursing_home_pr_amount || '0',
      //   Validators.pattern(NumberPattern)
      // ),

      planPayrollPRAmount: new FormControl(
        this.paymentsEditData.plan_payroll_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planPpePRAmount: new FormControl(
        this.paymentsEditData.plan_ppe_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      planPublicHealthPRAmount: new FormControl(
        this.paymentsEditData.plan_public_health_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      // planSmallBusinessPRAmount: new FormControl(
      //   this.paymentsEditData.plan_small_business_pr_amount || '0',
      //   Validators.pattern(NumberPattern)
      // ),

      // planUnemploymentPRAmount: new FormControl(
      //   this.paymentsEditData.plan_unemployment_pr_amount || '0',
      //   Validators.pattern(NumberPattern)
      // ),

      // planWorkersCompPRAmount: new FormControl(
      //   this.paymentsEditData.plan_workers_comp_pr_amount || '0',
      //   Validators.pattern(NumberPattern)
      // ),

      planOtherItemsPRAmount: new FormControl(
        this.paymentsEditData.plan_other_items_pr_amount || '0',
        Validators.pattern(NumberPattern)
      ),

      paymentRequestTotal: new FormControl(
        this.paymentsEditData.total_payment_request || 0
      ),

      relatedApplications: new FormControl(
        this.paymentsEditData.related_applications || 0
      ),
     
      milestonePercentage: new FormControl(
        this.paymentsEditData.milestone_percentage || 0
      ),
    })
  }

  private setupSecondForm() {

    this.secondFormGroup = new FormGroup({
      amountsIncludeGrantsOver50k: new FormControl(
        this.paymentsEditData.amounts_include_grants_over_50k || ''
      ),
      amountsIncludeLoansOver50k: new FormControl(
        this.paymentsEditData.amounts_include_loans_over_50k || ''
      ),
      amountsIncludeTransfersOver50k: new FormControl(
        this.paymentsEditData.amounts_include_transfers_over_50k || ''
      ),
      amountsIncludePaymentsOver50k: new FormControl(
        this.paymentsEditData.amounts_include_payments_over_50k || ''
      ),
      amountsIncludeContractsOver50k: new FormControl(
        this.paymentsEditData.amounts_include_contracts_over_50k || ''
      ),
    });
  }

  private setupFourthForm() {
    this.fourthFormGroup = new FormGroup({
      status: new FormControl(this.paymentsEditData.status || 'Open'),// not in html
    });
  }

  onStepOneSubmit() {
    if (this.firstFormGroup.valid) {
      console.log('first form values => ', this.firstFormGroup.value);
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.firstFormGroup);
    }
  }

  onStepTwoSubmit() {
    const condition = (
      this.secondFormGroup.get('amountsIncludeContractsOver50k').value === 'True' ||
      this.secondFormGroup.get('amountsIncludeGrantsOver50k').value === 'True' ||
      this.secondFormGroup.get('amountsIncludeLoansOver50k').value === 'True' ||
      this.secondFormGroup.get('amountsIncludeTransfersOver50k').value === 'True' ||
      this.secondFormGroup.get('amountsIncludePaymentsOver50k').value === 'True'
    )
    if (condition) {
      console.log('second form values => ', this.secondFormGroup.value);
    } else {
      this.toastr.error("Select at least one Payment type", "Error");
      this.validateAllFormFields(this.secondFormGroup);
    }
  }

  onStepThreeSubmit() {
    if (!this.isCompletedStepThree) {
      this.toastr.error("Form is not valid", "Error");
      return;
    }
    console.log('fourth form values => ', this.documents);
  }

  onStepFourSubmit() {
    if (this.fourthFormGroup.valid) {
      console.log('fourth form values => ', this.fourthFormGroup.value);
      this.submitPayment();
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.fourthFormGroup);
    }
  }

  private submitPayment() {

    const requiredFields = [];
    const mappingFilds = Constants.PAYMENT_MAPPING;

    const formData = Object.assign({},
      this.firstFormGroup.value,
      this.secondFormGroup.value,
      this.fourthFormGroup.value
    )

    const appObject = {};

    for (let key in mappingFilds) {
      let value = mappingFilds[key];
      if (formData[key] || requiredFields.includes(key)) {
        appObject[value] = formData[key];
      }
    }
    if (this.recordId) this.updatePaymentRequests(appObject);
    else this.createPaymentRequests(appObject);
  }

  private async createPaymentRequests(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.dfaData.paymentRequestData.TableId,
        null,
        new Array<FieldListItem>()
      );

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }

      recordFAD.fieldsList.push(new FieldListItem("validated", this.getPaymentValidationStatus(), ""))
      recordFAD.fieldsList.push(new FieldListItem("status", "Open", ""))

      this.loading = true;

      const appResp: any = await this.ignatiusService.postData(recordFAD).toPromise();
      const relatedPaymentRequestsId = appResp.recordId;
      await this.addDocument(relatedPaymentRequestsId);
      await this.submitPaymentForms(relatedPaymentRequestsId);
      this.paymentFormActionCompleted(true);
    } catch (error) {
      this.paymentFormActionCompleted(false);
    }
  }

  private async updatePaymentRequests(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.dfaData.paymentRequestData.TableId,
        new Where(Number(this.recordId)),
        new Array<FieldListItem>()
      );
      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }
      recordFAD.fieldsList.push(new FieldListItem("validated", this.getPaymentValidationStatus(), ""));

      this.loading = true;

      await this.ignatiusService.putData(recordFAD).toPromise();
      await this.addDocument(this.recordId);
      await this.submitPaymentForms();
      await this.deleteDocumentFromDb();
      this.paymentFormActionCompleted(true);
    } catch (error) {
      this.paymentFormActionCompleted(false);
    }
  }

  private paymentFormActionCompleted(success = true) {
    const msg = this.recordId ? 'Updated' : 'Created';
    const err = this.recordId ? 'Updating' : 'Creating';

    if (success) {
      this.toastr.success(`Payment Request ${msg} successfully`, 'Success');
      this.router.navigate(['payments']);
    } else {
      this.loading = false;
      this.toastr.error(`Error in ${err} Payment Request`, 'Error');
    }
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

  onPRAmountChange(fcName, PB, PPR, RP) {
    const compareValue = Number(PB) - Number(PPR);
    if (Number(RP) > compareValue) {
      this.firstFormGroup.get(fcName).setErrors({ 'incorrect': true });
    }

    this.firstFormGroup.patchValue({
      paymentRequestTotal: this.getTotalPaymentRequest(this.firstFormGroup.value, 'PRT')
    });

    // this.selectedProject.plan_admin_exp_pr_total

    this.stepOneFormStatus = false;
  }

  handleUpload(tempId, event) {
    const file = event.target.files[0];
    let base64String = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      base64String = reader.result.toString().split(",")[1];
      for (const iterator of this.documents) {
        if (iterator.tempId === tempId) {
          iterator[`document_${tempId}`] = base64String;
          iterator[`fileName_${tempId}`] = file.name;
          break;
        }
      }
      this.validateDocumentForm();
    };
  }

  private getTotalPaymentRequest(obj, key: string) {
    let keys;
    let sum = 0;

    switch (key) {
      case 'PRT':
        keys = Constants.PAYMENT_REQUEST_WORK_KEYS;
        break;
    }
    for (const iterator of keys) {
      if (!Number(obj[iterator])) continue;
      sum += obj[iterator] ? Number(obj[iterator]) : 0;
    }

    return sum;
  }

  async addDocument(relatedPaymentRequestsId) {
    try {

      const observables = [];

      for (const iterator of this.documents) {


        const tempId = iterator['tempId'];

        if (!iterator[`document_${tempId}`]) continue;

        const documentExpenditureCategory = iterator[`documentExpenditureCategory_${tempId}`];
        const documentTitle = iterator[`documentTitle_${tempId}`];
        const document = iterator[`document_${tempId}`];
        const fileName = iterator[`fileName_${tempId}`];

        const recordFAD = new FormActionData(0,
          this.dfaData.documentsData.TableId,
          null,
          new Array<FieldListItem>()
        );

        recordFAD.fieldsList = [
          new FieldListItem('related_projects', this.firstFormGroup.get('relatedProjects').value, ''),
          new FieldListItem('document_type_expenditure_category', documentExpenditureCategory, ''),
          new FieldListItem('related_applications', this.getRelatedApplications(), ''),
          new FieldListItem('related_payment_requests', relatedPaymentRequestsId, ''),
          new FieldListItem('document_type', 'Payment Request Attachment', ''),
          new FieldListItem('document_title', documentTitle, ''),
          new FieldListItem('document', fileName, document)
        ]

        observables.push(this.ignatiusService.postData(recordFAD))
      }

      await forkJoin(observables).toPromise();

    } catch (error) {
      throw error;
    }

  }

  onChangeDocumentTitle(tempId, title) {
    for (const iterator of this.documents) {
      if (iterator.tempId === tempId) {
        iterator[`documentTitle_${tempId}`] = title;
        break;
      }
    }
    this.validateDocumentForm();
  }

  onChangeDocumentExpenditureCategories(tempId, category) {
    for (const iterator of this.documents) {
      if (iterator.tempId === tempId) {
        iterator[`documentExpenditureCategory_${tempId}`] = category;
        break;
      }
    }
    this.validateDocumentForm();
  }

  addDocumentFormRow() {

    if (this.documents.length === 5) {
      this.toastr.error('Cant add more then 5 rows', 'Error');
      return
    }

    let obj = {};
    let tempId = uuid.v4();
    obj['tempId'] = tempId;
    obj[`document_${tempId}`] = "";
    obj[`fileName_${tempId}`] = "";
    obj[`documentTitle_${tempId}`] = "";
    obj[`documentExpenditureCategory_${tempId}`] = "";

    this.documentTitles[tempId] = "";
    this.documentExpenditureCategories[tempId] = "";

    this.documents.push(obj);

  }


  removeDocumentRow(tempId) {
    const index = this.documents.findIndex(x => x.tempId === tempId);
    this.documents.splice(index, 1);
    if (this.documents.length === 0) this.isCompletedStepThree = true;
    else this.validateDocumentForm();
  }

  downloadFile(file: any) {
    this.ignatiusService.downloadFile(
      this.dfaData.documentsData.TableId,
      file["id"],
      this.dfaData.documentsData.DocumentFileId,
      file["document"]
    );
  }

  deleteDocument(docId) {
    this.deletedDocuments.push(docId);
    this.paymentEditDocumentData = this.paymentEditDocumentData.filter(
      iterator => iterator.id !== docId
    )
  }

  async onLoadProjectInfo(projectId) {
    try {
      let applicationId;
      for (const iterator of this.projectsList) {
        if (iterator.id === projectId) {
          this.selectedProject = iterator;
          this.updateMilestoneList(iterator.max_milestone_percentage)
          applicationId = iterator.related_applications
        }
      }

      this.spinner.show();
      let applicationData = await this.ignatiusService.getTargetTableObservable(
        this.dfaData.appData,
        String(applicationId),
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

  async onProjectChange(projectId) {
    try {
      let applicationId;
      for (const iterator of this.projectsList) {
        if (iterator.id === projectId) {
          this.selectedProject = iterator;
          this.updateMilestoneList(iterator.max_milestone_percentage)
          applicationId = iterator.related_applications
        }
      }

      this.firstFormGroup.patchValue({ relatedApplications: applicationId });

      this.spinner.show();
      let applicationData = await this.ignatiusService.getTargetTableObservable(
        this.dfaData.appData,
        String(applicationId),
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

  private updateMilestoneList(milestonePercent) {

    if (milestonePercent === '0') return;
    this.milestonesList = this.milestonesInitialList.filter(itrator => {
      return Number(itrator.value.split('%')[0]) > Number(milestonePercent.split('%')[0]);
    })
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

  private getProjectList(proArr) {
    if (proArr.length === 0) return [];

    if (this.recordId) return proArr;

    return proArr.filter(elem => {
      const condition = (
        (elem.status === 'Submitted' || elem.status === 'Approved') &&
        elem.open_pr_count === '0' &&
        Number(elem.max_milestone_percentage) < 100
      )
      return condition
    })
  }

  async getProjectData(paymentEditData) {
    try {
      if (!this.recordId) return;

      for (const iterator of this.projectsList) {
        if (iterator.id === paymentEditData.related_projects) {
          this.selectedProject = this.getSelectedProjectData(iterator); //Only in Edit
        }
      }
    } catch (error) {
      this.spinner.hide()
      this.toastr.error('Error in fetching projectdata', "Error")
    }
  }

  getSelectedProjectData(projectObj) {
    let obj = Object.assign({}, projectObj)


    if (this.paymentsEditData.plan_admin_exp_pr_amount) {
      obj.plan_admin_exp_pr_total = Number(obj.plan_admin_exp_pr_total) -
        Number(this.paymentsEditData.plan_admin_exp_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_admin_exp_pr_amount)
    }

    if (this.paymentsEditData.plan_budgeted_diverted_pr_amount) {
      obj.plan_budgeted_diverted_pr_total = Number(obj.plan_budgeted_diverted_pr_total) -
        Number(this.paymentsEditData.plan_budgeted_diverted_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_budgeted_diverted_pr_amount)
    }

    if (this.paymentsEditData.plan_distance_learning_pr_amount) {
      obj.plan_distance_learning_pr_total = Number(obj.plan_distance_learning_pr_total) -
        Number(this.paymentsEditData.plan_distance_learning_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_distance_learning_pr_amount)
    }

    if (this.paymentsEditData.plan_food_pr_amount) {
      obj.plan_food_pr_total = Number(obj.plan_food_pr_total) -
        Number(this.paymentsEditData.plan_food_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_food_pr_amount)
    }

    if (this.paymentsEditData.plan_housing_pr_amount) {
      obj.plan_housing_pr_total = Number(obj.plan_housing_pr_total) -
        Number(this.paymentsEditData.plan_housing_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_housing_pr_amount)
    }

    if (this.paymentsEditData.plan_telework_pr_amount) {
      obj.plan_telework_pr_total = Number(obj.plan_telework_pr_total) -
        Number(this.paymentsEditData.plan_telework_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_telework_pr_amount)
    }

    if (this.paymentsEditData.plan_medical_pr_amount) {
      obj.plan_medical_pr_total = Number(obj.plan_medical_pr_total) -
        Number(this.paymentsEditData.plan_medical_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_medical_pr_amount)
    }

    if (this.paymentsEditData.plan_payroll_pr_amount) {
      obj.plan_payroll_pr_total = Number(obj.plan_payroll_pr_total) -
        Number(this.paymentsEditData.plan_payroll_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_payroll_pr_amount)
    }

    if (this.paymentsEditData.plan_ppe_pr_amount) {
      obj.plan_ppe_pr_total = Number(obj.plan_ppe_pr_total) -
        Number(this.paymentsEditData.plan_ppe_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_ppe_pr_amount)
    }

    if (this.paymentsEditData.plan_public_health_pr_amount) {
      obj.plan_public_health_pr_total = Number(obj.plan_public_health_pr_total) -
        Number(this.paymentsEditData.plan_public_health_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_public_health_pr_amount)
    }

    if (this.paymentsEditData.plan_other_items_pr_amount) {
      obj.plan_other_items_pr_total = Number(obj.plan_other_items_pr_total) -
        Number(this.paymentsEditData.plan_other_items_pr_amount)
      obj.total_payment_requests = Number(obj.total_payment_requests) -
        Number(this.paymentsEditData.plan_other_items_pr_amount)
    }

    return obj;

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

  private validateDocumentForm() {
    let status = true;
    for (const iterator of this.documents) {
      let tempId = iterator['tempId'];

      const condition = (
        !iterator[`document_${tempId}`] ||
        !iterator[`documentTitle_${tempId}`] ||
        !iterator[`documentExpenditureCategory_${tempId}`]
      )

      if (condition) {
        status = false;
        break;
      }
    }
    this.isCompletedStepThree = Boolean(this.documents.length === 0) || status;
  }

  private async deleteDocumentFromDb() {
    try {
      if (this.deletedDocuments.length === 0) return;

      const observables = [];
      for (let id of this.deletedDocuments) {
        const formActionData =
          new FormActionData(
            0,
            this.dfaData.documentsData.TableId,
            new Where(id),
            null
          );
        observables.push(this.ignatiusService.deleteData(formActionData))
      }
      await forkJoin(observables).toPromise();
    } catch (error) {
      throw error;
    }
  }

  private getRelatedApplications(): string {
    const projectId = this.firstFormGroup.get('relatedProjects').value;
    let applicationId;
    for (const iterator of this.projectsList) {
      if (iterator.id === projectId) {
        applicationId = iterator.related_applications
      }
    }
    return applicationId;
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

  onMilestoneChange(value) {
    if (!value) return;
    const milestoneNumber = Number(value.split('%')[0])
    this.firstFormGroup.patchValue({
      milestonePercentage: milestoneNumber
    });
  }

  verifyStepperOne() {

    if (!this.firstFormGroup.valid) {
      this.onStepOneSubmit();
      return;
    }

    let error: string = null;

    const projectBudget = Number(this.applicationData.total_request);
    const requested = Number(this.firstFormGroup.get('paymentRequestTotal').value);
    const milestonePercentage = this.firstFormGroup.get('milestonePercentage').value;
    const priorRequest = Number(this.selectedProject.total_payment_requests);

    if (requested < (projectBudget * (.01 * milestonePercentage) - priorRequest)) {
      error = 'Total Requested Amount is less than the Milestone percentage';
    }

    if (error) {
      this.toastr.error(error, 'Error');
      return;
    }

    this.stepOneFormStatus = true;

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
  contractsFromItemDescription: any = {};
  contractsFromMiscInfo: any = {};

  grantsFormData: Array<any> = [];
  grantsFromExpenditureType: any = {};
  grantsFromPayeeName: any = {};
  grantsFromPayeeIdentifyingNumber: any = {};
  grantsFromItemDate: any = {};
  grantsFromItemAmount: any = {};
  grantsFromExpenditureCategory: any = {};
  grantsFromItemNumber: any = {};
  grantsFromItemDescription: any = {};
  grantsFromMiscInfo: any = {};

  loansFormData: Array<any> = [];
  loansFromExpenditureType: any = {};
  loansFromPayeeName: any = {};
  loansFromPayeeIdentifyingNumber: any = {};
  loansFromItemDate: any = {};
  loansFromItemAmount: any = {};
  loansFromExpenditureCategory: any = {};
  loansFromItemNumber: any = {};
  loansFromItemDescription: any = {};
  loansFromPopDate: any = {};

  transfersFormData: Array<any> = [];
  transfersFromExpenditureType: any = {};
  transfersFromPayeeName: any = {};
  transfersFromPayeeIdentifyingNumber: any = {};
  transfersFromItemDate: any = {};
  transfersFromItemAmount: any = {};
  transfersFromExpenditureCategory: any = {};
  transfersFromItemDescription: any = {};

  directPaymentsFormData: Array<any> = [];
  directPaymentsFromExpenditureType: any = {};
  directPaymentsFromPayeeName: any = {};
  directPaymentsFromPayeeIdentifyingNumber: any = {};
  directPaymentsFromItemDate: any = {};
  directPaymentsFromItemAmount: any = {};
  directPaymentsFromExpenditureCategory: any = {};

  onContractsSelectionChange(mrChange: MatRadioChange) {
    if (mrChange.value == "True") {
      this.addPaymentFormRow('Contracts');
    }
    else {
      this.contractsFormData.splice(0, this.contractsFormData.length);
    }
  }
  onGrantsSelectionChange(mrChange: MatRadioChange) {
    if (mrChange.value == "True") {
      this.addPaymentFormRow('Grants');
    }
    else {
      this.grantsFormData.splice(0, this.grantsFormData.length);
    }
  }
  onLoansSelectionChange(mrChange: MatRadioChange) {
    if (mrChange.value == "True") {
      this.addPaymentFormRow('Loans');
    }
    else {
      this.loansFormData.splice(0, this.loansFormData.length);
    }
  }
  onTransfersSelectionChange(mrChange: MatRadioChange) {
    if (mrChange.value == "True") {
      this.addPaymentFormRow('Transfers');
    }
    else {
      this.transfersFormData.splice(0, this.transfersFormData.length);
    }
  }
  onDirectPaymentsSelectionChange(mrChange: MatRadioChange) {
    if (mrChange.value == "True") {
      this.addPaymentFormRow('Direct Payments');
    }
    else {
      this.directPaymentsFormData.splice(0, this.directPaymentsFormData.length);
    }
  }


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

        obj[`ItemNumber_${tempId}`] = "";
        obj[`ItemDescription_${tempId}`] = "";
        obj[`MiscInfo_${tempId}`] = "";

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

        obj[`ItemNumber_${tempId}`] = "";
        obj[`ItemDescription_${tempId}`] = "";
        obj[`MiscInfo_${tempId}`] = "";

        this.grantsFromExpenditureType[tempId] = type;
        this.grantsFromPayeeName[tempId] = "";
        this.grantsFromPayeeIdentifyingNumber[tempId] = "";
        this.grantsFromItemDate[tempId] = "";
        this.grantsFromItemAmount[tempId] = "";
        this.grantsFromExpenditureCategory[tempId] = "";
        this.grantsFromItemNumber[tempId] = "";
        this.grantsFromItemDescription[tempId] = "";
        this.grantsFromMiscInfo[tempId] = "";
        this.grantsFormData.push(obj);
        break;

      case 'Loans':

        obj[`ItemNumber_${tempId}`] = "";
        obj[`ItemDescription_${tempId}`] = "";
        obj[`PopDate_${tempId}`] = "";

        this.loansFromExpenditureType[tempId] = type;
        this.loansFromPayeeName[tempId] = "";
        this.loansFromPayeeIdentifyingNumber[tempId] = "";
        this.loansFromItemDate[tempId] = "";
        this.loansFromItemAmount[tempId] = "";
        this.loansFromExpenditureCategory[tempId] = "";
        this.loansFromItemNumber[tempId] = "";
        this.loansFromItemDescription[tempId] = "";
        this.loansFromPopDate[tempId] = "";
        this.loansFormData.push(obj);
        break;

      case 'Transfers':

        obj[`ItemDescription_${tempId}`] = "";

        this.transfersFromExpenditureType[tempId] = type;
        this.transfersFromPayeeName[tempId] = "";
        this.transfersFromPayeeIdentifyingNumber[tempId] = "";
        this.transfersFromItemDate[tempId] = "";
        this.transfersFromItemAmount[tempId] = "";
        this.transfersFromExpenditureCategory[tempId] = "";
        this.transfersFromItemDescription[tempId] = "";
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

  removePaymentFormSelectedRow(type: string, tempId: string, all: boolean = false) {

    let index;

    switch (type) {

      case 'Contracts':
        if (all) {
          if (this.recordId) {
            let count = 0;
            for (const iterator of this.contractsFormData) {
              if (count === 0) {
                count += 1;
                continue;
              }
              if (iterator.id) this.tresaryReportingDeleteIds.push(iterator.id);
              count += 1;
            }
          }
          this.contractsFormData.splice(1, this.contractsFormData.length - 1);
          break;
        }
        index = this.contractsFormData.findIndex(x => x.tempId === tempId);
        if (this.recordId) {
          this.tresaryReportingDeleteIds.push((this.contractsFormData[index]).id);
        }
        this.contractsFormData.splice(index, 1);
        break;

      case 'Grants':
        if (all) {
          if (this.recordId) {
            let count = 0;
            for (const iterator of this.grantsFormData) {
              if (count === 0) {
                count += 1;
                continue;
              }
              if (iterator.id) this.tresaryReportingDeleteIds.push(iterator.id);
            }
          }
          this.grantsFormData.splice(1, this.grantsFormData.length - 1);
          break;
        }
        index = this.grantsFormData.findIndex(x => x.tempId === tempId);
        if (this.recordId) {
          this.tresaryReportingDeleteIds.push((this.grantsFormData[index]).id);
        }
        this.grantsFormData.splice(index, 1);
        break;

      case 'Loans':
        if (all) {
          if (this.recordId) {
            let count = 0;
            for (const iterator of this.loansFormData) {
              if (count === 0) {
                count += 1;
                continue;
              }
              if (iterator.id) this.tresaryReportingDeleteIds.push(iterator.id);
              count += 1;
            }
          }
          this.loansFormData.splice(1, this.loansFormData.length - 1);
          break;
        }
        index = this.loansFormData.findIndex(x => x.tempId === tempId);
        if (this.recordId) {
          this.tresaryReportingDeleteIds.push((this.loansFormData[index]).id);
        }
        this.loansFormData.splice(index, 1);
        break;

      case 'Transfers':
        if (all) {
          if (this.recordId) {
            let count = 0;
            for (const iterator of this.transfersFormData) {
              if (count === 0) {
                count += 1;
                continue;
              }
              if (iterator.id) this.tresaryReportingDeleteIds.push(iterator.id);
              count += 1;
            }
          }
          this.transfersFormData.splice(1, this.transfersFormData.length - 1);
          break;
        }
        index = this.transfersFormData.findIndex(x => x.tempId === tempId);
        if (this.recordId) {
          this.tresaryReportingDeleteIds.push((this.transfersFormData[index]).id);
        }
        this.transfersFormData.splice(index, 1);
        break;

      case 'Direct Payments':
        if (all) {
          if (this.recordId) {
            let count = 0;
            for (const iterator of this.directPaymentsFormData) {
              if (count === 0) {
                count += 1;
                continue;
              }
              if (iterator.id) this.tresaryReportingDeleteIds.push(iterator.id);
              count += 1;
            }
          }
          this.directPaymentsFormData.splice(1, this.directPaymentsFormData.length - 1);
          break;
        }
        index = this.directPaymentsFormData.findIndex(x => x.tempId === tempId);
        if (this.recordId) {
          this.tresaryReportingDeleteIds.push((this.directPaymentsFormData[index]).id);
        }
        this.directPaymentsFormData.splice(index, 1);
        break;

      default:
        break;
    }

  }

  onPastePaymentForm(type: string, event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    let rows = pastedText.split('\n');


    for (const iterator of rows) {

      let obj = new Object();
      let tempId = uuid.v4();
      const currentRow = iterator.split('\t');

      obj[`id`] = null;
      obj[`tempId`] = tempId;
      obj[`ExpenditureType_${tempId}`] = type;
      obj[`ExpenditureCategory_${tempId}`] = currentRow[0];
      obj[`PayeeName_${tempId}`] = currentRow[1];
      obj[`PayeeIdentifyingNumber_${tempId}`] = currentRow[2];


      switch (type) {

        case 'Contracts':

          this.removeFirst(this.contractsFormData);

          obj[`ItemNumber_${tempId}`] = currentRow[3];
          obj[`ItemDescription_${tempId}`] = currentRow[4];
          obj[`ItemDate_${tempId}`] = currentRow[5];
          obj[`ItemAmount_${tempId}`] = currentRow[6];
          obj[`MiscInfo_${tempId}`] = currentRow[7];

          this.contractsFromExpenditureType[tempId] = type;
          this.contractsFromExpenditureCategory[tempId] = currentRow[0] || "";
          this.contractsFromPayeeName[tempId] = currentRow[1] || "";
          this.contractsFromPayeeIdentifyingNumber[tempId] = currentRow[2] || "";
          this.contractsFromItemNumber[tempId] = currentRow[3] || "";
          this.contractsFromItemDescription[tempId] = currentRow[4] || "";
          this.contractsFromItemDate[tempId] = currentRow[5] || "";
          this.contractsFromItemAmount[tempId] = currentRow[6] || "";
          this.contractsFromMiscInfo[tempId] = currentRow[7] || "";
          this.contractsFormData.push(obj);
          break;

        case 'Grants':

          this.removeFirst(this.grantsFormData);

          obj[`ItemNumber_${tempId}`] = currentRow[3];
          obj[`ItemDate_${tempId}`] = currentRow[4];
          obj[`ItemAmount_${tempId}`] = currentRow[5];
          obj[`ItemDescription_${tempId}`] = currentRow[6];
          obj[`MiscInfo_${tempId}`] = currentRow[7];

          this.grantsFromExpenditureType[tempId] = type;
          this.grantsFromExpenditureCategory[tempId] = currentRow[0] || "";
          this.grantsFromPayeeName[tempId] = currentRow[1] || "";
          this.grantsFromPayeeIdentifyingNumber[tempId] = currentRow[2] || "";
          this.grantsFromItemNumber[tempId] = currentRow[3] || "";
          this.grantsFromItemDate[tempId] = currentRow[4] || "";
          this.grantsFromItemAmount[tempId] = currentRow[5] || "";
          this.grantsFromItemDescription[tempId] = currentRow[6] || "";
          this.grantsFromMiscInfo[tempId] = currentRow[7] || "";
          this.grantsFormData.push(obj)
          break;

        case 'Loans':

          this.removeFirst(this.loansFormData);

          obj[`ItemNumber_${tempId}`] = currentRow[3];
          obj[`ItemDate_${tempId}`] = currentRow[4];
          obj[`ItemAmount_${tempId}`] = currentRow[5];
          obj[`ItemDescription_${tempId}`] = currentRow[6];
          obj[`PopDate_${tempId}`] = currentRow[7];

          this.loansFromExpenditureType[tempId] = type;
          this.loansFromExpenditureCategory[tempId] = currentRow[0] || "";
          this.loansFromPayeeName[tempId] = currentRow[1] || "";
          this.loansFromPayeeIdentifyingNumber[tempId] = currentRow[2] || "";
          this.loansFromItemNumber[tempId] = currentRow[3] || "";
          this.loansFromItemDate[tempId] = currentRow[4] || "";
          this.loansFromItemAmount[tempId] = currentRow[5] || "";
          this.loansFromItemDescription[tempId] = currentRow[6] || "";
          this.loansFromPopDate[tempId] = currentRow[7] || "";
          this.loansFormData.push(obj)
          break;

        case 'Transfers':

          this.removeFirst(this.transfersFormData);

          obj[`ItemDate_${tempId}`] = currentRow[3];
          obj[`ItemAmount_${tempId}`] = currentRow[4];
          obj[`ItemDescription_${tempId}`] = currentRow[5];

          this.transfersFromExpenditureType[tempId] = type;
          this.transfersFromExpenditureCategory[tempId] = currentRow[0] || "";
          this.transfersFromPayeeName[tempId] = currentRow[1] || "";
          this.transfersFromPayeeIdentifyingNumber[tempId] = currentRow[2] || "";
          this.transfersFromItemDate[tempId] = currentRow[3] || "";
          this.transfersFromItemAmount[tempId] = currentRow[4] || "";
          this.transfersFromItemDescription[tempId] = currentRow[5] || "";
          this.transfersFormData.push(obj)
          break;

        case 'Direct Payments':

          obj[`ItemDate_${tempId}`] = currentRow[3];
          obj[`ItemAmount_${tempId}`] = currentRow[4];

          this.removeFirst(this.directPaymentsFormData);

          this.directPaymentsFromExpenditureType[tempId] = type;
          this.directPaymentsFromExpenditureCategory[tempId] = currentRow[0] || "";
          this.directPaymentsFromPayeeName[tempId] = currentRow[1] || "";
          this.directPaymentsFromPayeeIdentifyingNumber[tempId] = currentRow[2] || "";
          this.directPaymentsFromItemDate[tempId] = currentRow[3] || "";
          this.directPaymentsFromItemAmount[tempId] = currentRow[4] || "";
          this.directPaymentsFormData.push(obj)
          break;

        default:
          break;
      }

    }

  }

  onChangePayeeName(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeName_${tempId}`] = value;
          }
        }
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeName_${tempId}`] = value;
          }
        }
        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeName_${tempId}`] = value;
          }
        }
        break;

      case 'Transfers':
        for (const iterator of this.transfersFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeName_${tempId}`] = value;
          }
        }
        break;

      case 'Direct Payments':
        for (const iterator of this.directPaymentsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeName_${tempId}`] = value;
          }
        }
        break;

      default:
        break;
    }

  }

  onChangePayeeIdentifyingNumber(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeIdentifyingNumber_${tempId}`] = value;
          }
        }
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeIdentifyingNumber_${tempId}`] = value;
          }
        }
        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeIdentifyingNumber_${tempId}`] = value;
          }
        }
        break;

      case 'Transfers':
        for (const iterator of this.transfersFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeIdentifyingNumber_${tempId}`] = value;
          }
        }
        break;

      case 'Direct Payments':
        for (const iterator of this.directPaymentsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PayeeIdentifyingNumber_${tempId}`] = value;
          }
        }
        break;

      default:
        break;
    }
  }

  onChangeItemDate(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDate_${tempId}`] = value;
          }
        }
        this.ContractsFormStatus = false;
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDate_${tempId}`] = value;
          }
        }
        this.GrantsFormStatus = false;

        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDate_${tempId}`] = value;
          }
        }
        this.LoansFormStatus = false;

        break;

      case 'Transfers':
        for (const iterator of this.transfersFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDate_${tempId}`] = value;
          }
        }
        this.TransfersFormStatus = false;

        break;

      case 'Direct Payments':
        for (const iterator of this.directPaymentsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDate_${tempId}`] = value;
          }
        }
        this.DirectPaymentsFormStatus = false;

        break;

      default:
        break;
    }
  }

  onChangeItemAmount(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemAmount_${tempId}`] = value;
          }
        }
        this.ContractsFormStatus = false;
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemAmount_${tempId}`] = value;
          }
        }
        this.GrantsFormStatus = false;
        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemAmount_${tempId}`] = value;
          }
        }
        this.LoansFormStatus = false;

        break;

      case 'Transfers':
        for (const iterator of this.transfersFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemAmount_${tempId}`] = value;
          }
        }
        this.TransfersFormStatus = false;
        break;

      case 'Direct Payments':
        for (const iterator of this.directPaymentsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemAmount_${tempId}`] = value;
          }
        }
        this.DirectPaymentsFormStatus = false;
        break;

      default:
        break;
    }
  }

  onChangeExpenditureCategory(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ExpenditureCategory_${tempId}`] = value;
          }
        }
        this.ContractsFormStatus = false;
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ExpenditureCategory_${tempId}`] = value;
          }
        }
        this.GrantsFormStatus = false;
        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ExpenditureCategory_${tempId}`] = value;
          }
        }
        this.LoansFormStatus = false;
        break;

      case 'Transfers':
        for (const iterator of this.transfersFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ExpenditureCategory_${tempId}`] = value;
          }
        }
        this.TransfersFormStatus = false;
        break;

      case 'Direct Payments':
        for (const iterator of this.directPaymentsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ExpenditureCategory_${tempId}`] = value;
          }
        }
        this.DirectPaymentsFormStatus = false;
        break;

      default:
        break;
    }
  }


  onChangeItemNumber(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemNumber_${tempId}`] = value;
          }
        }
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemNumber_${tempId}`] = value;
          }
        }
        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemNumber_${tempId}`] = value;
          }
        }
        break;

      default:
        break;
    }
  }

  onChangeItemDescription(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDescription_${tempId}`] = value;
          }
        }

        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDescription_${tempId}`] = value;
          }
        }
        break;

      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDescription_${tempId}`] = value;
          }
        }
        break;

      case 'Transfers':
        for (const iterator of this.transfersFormData) {
          if (iterator.tempId === tempId) {
            iterator[`ItemDescription_${tempId}`] = value;
          }
        }
        break;

      default:
        break;
    }
  }

  onChangeMiscInfo(type, tempId, value) {
    switch (type) {
      case 'Contracts':
        for (const iterator of this.contractsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`MiscInfo_${tempId}`] = value;
          }
        }
        break;

      case 'Grants':
        for (const iterator of this.grantsFormData) {
          if (iterator.tempId === tempId) {
            iterator[`MiscInfo_${tempId}`] = value;
          }
        }
        break;

      default:
        break;
    }
  }

  onChangePopDate(type, tempId, value) {
    switch (type) {
      case 'Loans':
        for (const iterator of this.loansFormData) {
          if (iterator.tempId === tempId) {
            iterator[`PopDate_${tempId}`] = value;
          }
        }
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
      obj[`PayeeName_${tempId}`] = iterator.party_name;
      obj[`PayeeIdentifyingNumber_${tempId}`] = iterator.identifying_info;
      obj[`ItemDate_${tempId}`] = iterator.item_date;
      obj[`ItemAmount_${tempId}`] = iterator.item_amount;
      obj[`ExpenditureCategory_${tempId}`] = iterator.expenditure_category;

      switch (iterator.type) {

        case 'Contracts':

          obj[`ItemNumber_${tempId}`] = iterator.item_number;
          obj[`ItemDescription_${tempId}`] = iterator.item_description;
          obj[`MiscInfo_${tempId}`] = iterator.misc_info;

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

          obj[`ItemNumber_${tempId}`] = iterator.item_number;
          obj[`ItemDescription_${tempId}`] = iterator.item_description;
          obj[`MiscInfo_${tempId}`] = iterator.misc_info;

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

          obj[`ItemNumber_${tempId}`] = iterator.item_number;
          obj[`ItemDescription_${tempId}`] = iterator.item_description;
          obj[`PopDate_${tempId}`] = iterator.period_of_performance_end_date;

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

          obj[`ItemDescription_${tempId}`] = iterator.item_description;

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


  async submitPaymentForms(id = "") {
    try {
      if (this.recordId) await this.updateTresauryReporting();
      else await this.createTresauryReporting(id);
    } catch (error) {
      console.log('Error in [submitPaymentForms] => ', error);
    }
  }

  private async createTresauryReporting(id: string) {
    try {

      const observables = [];
      const reqArr = [];

      if (this.contractsFormData.length > 0) reqArr.push(...this.contractsFormData);
      if (this.grantsFormData.length > 0) reqArr.push(...this.grantsFormData);
      if (this.loansFormData.length > 0) reqArr.push(...this.loansFormData);
      if (this.transfersFormData.length > 0) reqArr.push(...this.transfersFormData);
      if (this.directPaymentsFormData.length > 0) reqArr.push(...this.directPaymentsFormData);

      for (const iterator of reqArr) {

        const tempId = iterator['tempId'];
        const recordFAD = new FormActionData(0,
          this.dfaData.treasuryReportingData.TableId,
          null,
          new Array<FieldListItem>()
        );

        const continueCondition = (
          // !iterator[`ExpenditureType_${tempId}`] &&
          !iterator[`PayeeName_${tempId}`] &&
          !iterator[`PayeeIdentifyingNumber_${tempId}`] &&
          !iterator[`ItemDate_${tempId}`] &&
          !iterator[`ItemAmount_${tempId}`] &&
          !iterator[`ExpenditureCategory_${tempId}`]
        )
        if (continueCondition) continue;

        recordFAD.fieldsList = [
          new FieldListItem('type', iterator[`ExpenditureType_${tempId}`] || "", ""),
          new FieldListItem('expenditure_category', iterator[`ExpenditureCategory_${tempId}`] || "", ""),
          new FieldListItem('party_name', iterator[`PayeeName_${tempId}`] || "", ""),
          new FieldListItem('related_payment_requests', id, ""),
          new FieldListItem('item_date', iterator[`ItemDate_${tempId}`] || "", ""),
          new FieldListItem('item_amount', iterator[`ItemAmount_${tempId}`] || "", ""),
          new FieldListItem('identifying_info', iterator[`PayeeIdentifyingNumber_${tempId}`] || "", "")
        ]

        switch (iterator[`ExpenditureType_${tempId}`]) {
          case 'Contracts':
            recordFAD.fieldsList.push(
              new FieldListItem('item_number', iterator[`ItemNumber_${tempId}`] || "", ""),
              new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
              new FieldListItem('misc_info', iterator[`MiscInfo_${tempId}`] || "", ""),
            )
            break;

          case 'Grants':
            recordFAD.fieldsList.push(
              new FieldListItem('item_number', iterator[`ItemNumber_${tempId}`] || "", ""),
              new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
              new FieldListItem('misc_info', iterator[`MiscInfo_${tempId}`] || "", ""),
            )
            break;

          case 'Loans':
            recordFAD.fieldsList.push(
              new FieldListItem('item_number', iterator[`ItemNumber_${tempId}`] || "", ""),
              new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
              new FieldListItem('period_of_performance_end_date', iterator[`PopDate_${tempId}`] || "", ""),
            )
            break;

          case 'Transfers':
            recordFAD.fieldsList.push(
              new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
            )
            break;

          default:
            break;
        }


        observables.push(this.ignatiusService.postData(recordFAD));

      }

      await forkJoin(observables).toPromise();

    } catch (error) {
      console.log('Error in [createTresauryReporting] => ', error);
    }

  }

  private async updateTresauryReporting() {

    try {
      const observables = [];
      const reqArr = [];

      if (this.contractsFormData.length > 0) reqArr.push(...this.contractsFormData);
      if (this.grantsFormData.length > 0) reqArr.push(...this.grantsFormData);
      if (this.loansFormData.length > 0) reqArr.push(...this.loansFormData);
      if (this.transfersFormData.length > 0) reqArr.push(...this.transfersFormData);
      if (this.directPaymentsFormData.length > 0) reqArr.push(...this.directPaymentsFormData);

      for (const iterator of reqArr) {
        if (iterator.id) {
          const formActionData =
            new FormActionData(
              0,
              this.dfaData.treasuryReportingData.TableId,
              new Where(iterator.id),
              null
            );
          observables.push(this.ignatiusService.deleteData(formActionData))
        }
      }

      //id deleted by user on update
      for (const iterator of this.tresaryReportingDeleteIds) {
        const formActionData =
          new FormActionData(
            0,
            this.dfaData.treasuryReportingData.TableId,
            new Where(iterator),
            null
          );
        observables.push(this.ignatiusService.deleteData(formActionData))
      }



      /**
       * On update deleted all record then create new records.This is not the right way but doing
       * this because Nancy want me to do this.
       */
      await forkJoin(observables).toPromise();
      await this.createTresauryReporting(this.recordId);
    } catch (error) {

    }

    // try {
    //   const observables = [];
    //   const reqArr = [];

    //   if (this.contractsFormData.length > 0) reqArr.push(...this.contractsFormData);
    //   if (this.grantsFormData.length > 0) reqArr.push(...this.grantsFormData);
    //   if (this.loansFormData.length > 0) reqArr.push(...this.loansFormData);
    //   if (this.transfersFormData.length > 0) reqArr.push(...this.transfersFormData);
    //   if (this.directPaymentsFormData.length > 0) reqArr.push(...this.directPaymentsFormData);

    //   for (const iterator of reqArr) {

    //     const tempId = iterator['tempId'];
    //     const recordFAD = new FormActionData(0,
    //       this.dfaData.treasuryReportingData.TableId,
    //       null,
    //       new Array<FieldListItem>()
    //     );

    //     const continueCondition = (
    //       // !iterator[`ExpenditureType_${tempId}`] &&
    //       !iterator[`PayeeName_${tempId}`] &&
    //       !iterator[`PayeeIdentifyingNumber_${tempId}`] &&
    //       !iterator[`ItemDate_${tempId}`] &&
    //       !iterator[`ItemAmount_${tempId}`] &&
    //       !iterator[`ExpenditureCategory_${tempId}`]
    //     )
    //     if (continueCondition) continue;

    //     recordFAD.fieldsList = [
    //       new FieldListItem('type', iterator[`ExpenditureType_${tempId}`] || "", ""),
    //       new FieldListItem('expenditure_category', iterator[`ExpenditureCategory_${tempId}`] || "", ""),
    //       new FieldListItem('party_name', iterator[`PayeeName_${tempId}`] || "", ""),
    //       new FieldListItem('item_date', iterator[`ItemDate_${tempId}`] || "", ""),
    //       new FieldListItem('item_amount', iterator[`ItemAmount_${tempId}`] || "", ""),
    //       new FieldListItem('identifying_info', iterator[`PayeeIdentifyingNumber_${tempId}`] || "", "")
    //     ]

    //     switch (iterator[`ExpenditureType_${tempId}`]) {
    //       case 'Contracts':
    //         recordFAD.fieldsList.push(
    //           new FieldListItem('item_number', iterator[`ItemNumber_${tempId}`] || "", ""),
    //           new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
    //           new FieldListItem('misc_info', iterator[`MiscInfo_${tempId}`] || "", ""),
    //         )
    //         break;

    //       case 'Grants':
    //         recordFAD.fieldsList.push(
    //           new FieldListItem('item_number', iterator[`ItemNumber_${tempId}`] || "", ""),
    //           new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
    //           new FieldListItem('misc_info', iterator[`MiscInfo_${tempId}`] || "", ""),
    //         )
    //         break;

    //       case 'Loans':
    //         recordFAD.fieldsList.push(
    //           new FieldListItem('item_number', iterator[`ItemNumber_${tempId}`] || "", ""),
    //           new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
    //           new FieldListItem('period_of_performance_end_date', iterator[`PopDate_${tempId}`] || "", ""),
    //         )
    //         break;

    //       case 'Transfers':
    //         recordFAD.fieldsList.push(
    //           new FieldListItem('item_description', iterator[`ItemDescription_${tempId}`] || "", ""),
    //         )
    //         break;

    //       default:
    //         break;
    //     }

    //     if (iterator.id) {
    //       recordFAD.where = new Where(iterator.id);
    //       observables.push(this.ignatiusService.putData(recordFAD));
    //     } else {
    //       recordFAD.fieldsList.push(new FieldListItem('related_payment_requests', this.recordId, ""))
    //       observables.push(this.ignatiusService.postData(recordFAD));
    //     }
    //   }

    //   await forkJoin(observables).toPromise();

    // } catch (error) {
    //   console.log('Error in [updateTresauryReporting] => ', error);
    // }

  }

  removeFirst(arr) {
    let value = false;
    for (const key in arr[0]) {

      const element = arr[0][key];
      const tempId = arr[0]['tempId'];

      if (key === 'tempId' || key === 'id' || key === `ExpenditureType_${tempId}`) continue;
      if (element) value = true;
    }
    if (!value) arr.splice(0, 1)
  }

  showSummaryData(type: string, expCategory: string) {

    let amount = 0;
    let arrData = [];

    switch (type) {
      case 'Contracts':
        arrData = this.contractsFormData;
        break;

      case 'Grants':
        arrData = this.grantsFormData;

        break;

      case 'Loans':
        arrData = this.loansFormData;

        break;

      case 'Transfers':
        arrData = this.transfersFormData;

        break;

      case 'Direct Payments':
        arrData = this.directPaymentsFormData;

        break;

      default:
        break;
    }

    for (const iterator of arrData) {
      let tempId = iterator['tempId'];
      let expCat = iterator[`ExpenditureCategory_${tempId}`];
      let thisAmount = iterator[`ItemAmount_${tempId}`];

      if (expCat === expCategory && thisAmount) {
        amount += Number(thisAmount);
      }
    }

    return amount;// || 'NA';

  }

  getSummaryStatus(reqPayment: string, expCategory: string) {

    if (!reqPayment) return;

    let amount = 0;

    const dataArr = [
      ...this.contractsFormData,
      ...this.grantsFormData,
      ...this.loansFormData,
      ...this.transfersFormData,
      ...this.directPaymentsFormData,
    ]

    for (const iterator of dataArr) {
      let tempId = iterator['tempId'];
      let expCat = iterator[`ExpenditureCategory_${tempId}`];
      let thisAmount = iterator[`ItemAmount_${tempId}`];

      if (expCat === expCategory && thisAmount) {
        amount += Number(thisAmount);
      }
    }

    let status = Boolean(amount === Number(reqPayment));
    return status;
  }

  getPaymentValidationStatus() {
    const status = (
      this.getSummaryStatus(this.firstFormGroup.get('planAdminExpPRAmount').value, 'Administrative Expenses') &&
      this.getSummaryStatus(this.firstFormGroup.get('planBudgetedDivertedPRAmount').value, 'Personnel and Services Diverted to a Substantially Different Use') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planTestingPRAmount').value, 'COVID-19 Testing and Contact Tracing') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planEconomicSupportPRAmount').value, 'Economic Support (Other than Small Business, Housing, and Food Assistance)') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planIssuanceOfTaxPRAmount').value, 'Expenses Associated with the Issuance of Tax Anticipation Notes') &&
      this.getSummaryStatus(this.firstFormGroup.get('planDistanceLearningPRAmount').value, 'Facilitating Distance Learning') &&
      this.getSummaryStatus(this.firstFormGroup.get('planFoodPRAmount').value, 'Food Programs') &&
      this.getSummaryStatus(this.firstFormGroup.get('planHousingPRAmount').value, 'Housing Support') &&
      this.getSummaryStatus(this.firstFormGroup.get('planTeleworkPRAmount').value, 'Improve Telework Capabilities of Public Employees') &&
      this.getSummaryStatus(this.firstFormGroup.get('planMedicalPRAmount').value, 'Medical Expenses') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planNursingHomePRAmount').value, 'Nursing Home Assistance') &&
      this.getSummaryStatus(this.firstFormGroup.get('planPayrollPRAmount').value, 'Payroll for Public Health and Safety Employees') &&
      this.getSummaryStatus(this.firstFormGroup.get('planPpePRAmount').value, 'Personal Protective Equipment') &&
      this.getSummaryStatus(this.firstFormGroup.get('planPublicHealthPRAmount').value, 'Public Health Expenses') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planSmallBusinessPRAmount').value, 'Small Business Assistance') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planUnemploymentPRAmount').value, 'Unemployment Benefits') &&
      //this.getSummaryStatus(this.firstFormGroup.get('planWorkersCompPRAmount').value, 'Workers Compensation') &&
      this.getSummaryStatus(this.firstFormGroup.get('planOtherItemsPRAmount').value, 'Other Items')
    )

    if (status) return 'True';
    else return 'False';

  }

  verifyForms(type) {

    const expenditureCategories = this.expenditureCategoryList.map(elem => elem.value);
    let arrData: Array<any>;
    let error: string = null;
    let rowCount = 0;

    switch (type) {
      case 'Contracts':
        arrData = this.contractsFormData;
        break;

      case 'Grants':
        arrData = this.grantsFormData;
        break;

      case 'Loans':
        arrData = this.loansFormData;
        break;

      case 'Transfers':
        arrData = this.transfersFormData;
        break;

      case 'Direct Payments':
        arrData = this.directPaymentsFormData;
        break;

      default:
        break;
    }

    for (const iterator of arrData) {

      rowCount += 1;

      const tempId = iterator['tempId'];
      const ItemDate = iterator[`ItemDate_${tempId}`];
      const ItemAmount = iterator[`ItemAmount_${tempId}`];
      const ExpenditureCategory = iterator[`ExpenditureCategory_${tempId}`];
      const dateRegex = /^(0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?\d\d$/i;
      const amountregex = /^\d{1,5}(\.\d{1,2})?$/;

      if (!ExpenditureCategory || !expenditureCategories.includes(ExpenditureCategory)) {
        error = `A valid Expenditure Category is required in row ${rowCount}`;
        break;
      }

      if (!ItemDate || !dateRegex.test(ItemDate)) {
        error = `A valid Date (MM/DD/YY) is required in row ${rowCount}`;
        break;
      }

      if (!ItemAmount || !amountregex.test(ItemAmount)) {
        error = `A valid Amount is required in row ${rowCount}`;
        break;
      }

    }

    if (error) {
      this.toastr.error(error, 'Error');
      return;
    }

    switch (type) {
      case 'Contracts':
        this.ContractsFormStatus = true;
        break;

      case 'Grants':
        this.GrantsFormStatus = true;
        break;

      case 'Loans':
        this.LoansFormStatus = true;
        break;

      case 'Transfers':
        this.TransfersFormStatus = true;
        break;

      case 'Direct Payments':
        this.DirectPaymentsFormStatus = true;
        break;

      default:
        break;
    }

  }

  //=============================== Treasury Reporting end ===============================>

  cancelChanges(content) {
    const isFormDirty = this.firstFormGroup.dirty || this.secondFormGroup.dirty
      || this.fourthFormGroup;

    if (isFormDirty) {
      this.modelConfig = new PopupModel();
      this.modelConfig.title = 'Confirmation';
      this.modelConfig.settings.size = 'sm';
      this.ngbModal.open(content, this.modelConfig.settings)
    } else {
      this.redirectToPayments();
    }
  }


  redirectToPayments(closeModal = false) {
    closeModal && this.ngbModal.dismissAll();
    this.router.navigate(['payments']);
  }

}


