import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/shared/constants';
import { FieldListItem, FormActionData, Where } from 'src/app/models/form-action-data';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';
import { formatDate } from '@angular/common';
import * as uuid from 'uuid';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupModel } from 'src/app/modules/dashboards/models/popup';


/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-businessapplications-add',
  templateUrl: './businessapplications-add.component.html',
  styleUrls: ['./businessapplications-add.component.css']
})
export class BusinessApplicationsAddComponent implements OnInit {

  recordId: string;
  applicationEditData: any;
  documentSelectionTypes: Array<any>;
  applicationEditDocumentData: any;

  applicantList: Array<{ id: string, name: string }>;
  doralData = this.projectSpecificService.getProjectSpecificData();
  documents: Array<any> = [];
  deletedDocuments: Array<any> = [];
  documentTypes = {
  };
  documentTitles = {};
  isCompletedStepFour: boolean = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  // fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  modelConfig: PopupModel;
  applicantData: any;
  applicantRemainingAmount: number;
  dunsNumber: number;

  loading: boolean = false;
  thirdFormStatus: boolean = false;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private ignatiusService: IgnatiusService,
    private storageService: StorageService,
    private projectSpecificService: ProjectSpecificService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.documentSelectionTypes = componentData[0];
    this.applicationEditData = (componentData && componentData[1]) ? componentData[1][0] : {};
    this.applicationEditDocumentData = (componentData && componentData[2]) ? componentData[2] : [];
    this.applicationEditDocumentData = this.applicationEditDocumentData.filter(
      iterator => iterator.document_type === "Application Attachment"
    )
    this.applicantData = this.storageService.getItem('userSessionData');
    this.applicantRemainingAmount = Number(this.applicantData.remaining_amount) + (this.applicationEditData["total_request"] ? Number(this.applicationEditData["total_request"]) : 0);
    //alert(this.applicantData.remaining_amount + " " + this.applicationEditData["total_request"] + " " + this.applicantRemainingAmount)
    this.dunsNumber = this.applicantData.duns_number;
    this.setupForm();
    this.spinner.hide();
  }

  private setupForm() {
    this.setupFirstForm();
    this.setupSecondForm();
    this.setupThirdForm();
    this.setupFifthForm();
  }

  private setupFirstForm() {
    this.firstFormGroup = new FormGroup({
      relatedApplicants: new FormControl(
        (this.storageService.getItem('userSessionData')).applicantId
      ),
      applicationTitle: new FormControl(this.applicationEditData.application_title || '', Validators.required),
      isCovid: new FormControl(this.applicationEditData.is_covid || '', Validators.required),
      isCovidComments: new FormControl(this.applicationEditData.is_covid_comments || ''),
      isNecessary: new FormControl(this.applicationEditData.is_necessary || '', Validators.required),
      isNecessaryComments: new FormControl(this.applicationEditData.is_necessary_comments || ''),
      hasNormalCosts: new FormControl(this.applicationEditData.has_normal_costs || '', Validators.required),
      hasNormalCostsComments: new FormControl(this.applicationEditData.has_normal_costs_comments || ''),
      hasOtherFunding: new FormControl(this.applicationEditData.has_other_funding || '', Validators.required),
      hasOtherFundingComments: new FormControl(this.applicationEditData.has_other_funding_comments || ''),
      completedOnTime: new FormControl(this.applicationEditData.completed_on_time || '', Validators.required),
      completedOnTimeComments: new FormControl(this.applicationEditData.completed_on_time_comments || '')
    });
  }

  private setupSecondForm() {
    this.secondFormGroup = new FormGroup({
      projectDefinition: new FormControl(
        this.applicationEditData.project_definition || '',
        Validators.required
      ),
      projectDescription: new FormControl(
        this.applicationEditData.project_description || '',
        Validators.required
      ),
    });
  }

  private setupThirdForm() {

    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    this.thirdFormGroup = new FormGroup({
      planAdminExpDesc: new FormControl(this.applicationEditData.plan_admin_exp_desc || ''),
      planAdminExpAmount: new FormControl(
        this.applicationEditData.plan_admin_exp_amount || '',
        [Validators.pattern(NumberPattern)]
      ),
      planAdminExpAmountTBC: new FormControl(
        this.applicationEditData.plan_admin_exp_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planBudgetedDivertedDesc: new FormControl(this.applicationEditData.plan_budgeted_diverted_desc || ''),
      planBudgetedDivertedAmount: new FormControl(
        this.applicationEditData.plan_budgeted_diverted_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planBudgetedDivertedAmountTBC: new FormControl(
        this.applicationEditData.plan_budgeted_diverted_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      // planTestingDesc: new FormControl(this.applicationEditData.plan_testing_desc || ''),
      // planTestingAmount: new FormControl(
      //   this.applicationEditData.plan_testing_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planTestingAmountTBC: new FormControl(
      //   this.applicationEditData.plan_testing_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planEconomicSupportDesc: new FormControl(this.applicationEditData.plan_economic_support_desc || ''),
      // planEconomicSupportAmount: new FormControl(
      //   this.applicationEditData.plan_economic_support_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planEconomicSupportAmountTBC: new FormControl(
      //   this.applicationEditData.plan_economic_support_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planIssuanceOfTaxDesc: new FormControl(this.applicationEditData.plan_issuance_of_tax_desc || ''),
      // planIssuanceOfTaxAmount: new FormControl(
      //   this.applicationEditData.plan_issuance_of_tax_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planIssuanceOfTaxAmountTBC: new FormControl(
      //   this.applicationEditData.plan_issuance_of_tax_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      planDistanceLearningDesc: new FormControl(this.applicationEditData.plan_distance_learning_desc || ''),
      planDistanceLearningAmount: new FormControl(
        this.applicationEditData.plan_distance_learning_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planDistanceLearningAmountTBC: new FormControl(
        this.applicationEditData.plan_distance_learning_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planFoodDesc: new FormControl(this.applicationEditData.plan_food_desc || ''),
      planFoodAmount: new FormControl(
        this.applicationEditData.plan_food_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planFoodAmountTBC: new FormControl(
        this.applicationEditData.plan_food_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planHousingDesc: new FormControl(this.applicationEditData.plan_housing_desc || ''),
      planHousingAmount: new FormControl(
        this.applicationEditData.plan_housing_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planHousingAmountTBC: new FormControl(
        this.applicationEditData.plan_housing_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planTeleworkDesc: new FormControl(this.applicationEditData.plan_telework_desc || ''),
      planTeleworkAmount: new FormControl(
        this.applicationEditData.plan_telework_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planTeleworkAmountTBC: new FormControl(
        this.applicationEditData.plan_telework_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planMedicalDesc: new FormControl(this.applicationEditData.plan_medical_desc || ''),
      planMedicalAmount: new FormControl(
        this.applicationEditData.plan_medical_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planMedicalAmountTBC: new FormControl(
        this.applicationEditData.plan_medical_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      // planNursingHomeDesc: new FormControl(this.applicationEditData.plan_nursing_home_desc || ''),
      // planNursingHomeAmount: new FormControl(
      //   this.applicationEditData.plan_nursing_home_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planNursingHomeAmountTBC: new FormControl(
      //   this.applicationEditData.plan_nursing_home_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      planPayrollDesc: new FormControl(this.applicationEditData.plan_payroll_desc || ''),
      planPayrollAmount: new FormControl(
        this.applicationEditData.plan_payroll_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planPayrollAmountTBC: new FormControl(
        this.applicationEditData.plan_payroll_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planPpeDesc: new FormControl(this.applicationEditData.plan_ppe_desc || ''),
      planPpeAmount: new FormControl(
        this.applicationEditData.plan_ppe_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planPpeAmountTBC: new FormControl(
        this.applicationEditData.plan_ppe_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      planPublicHealthDesc: new FormControl(this.applicationEditData.plan_public_health_desc || ''),
      planPublicHealthAmount: new FormControl(
        this.applicationEditData.plan_public_health_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planPublicHealthAmountTBC: new FormControl(
        this.applicationEditData.plan_public_health_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      // planSmallBusinessDesc: new FormControl(this.applicationEditData.plan_small_business_desc || ''),
      // planSmallBusinessAmount: new FormControl(
      //   this.applicationEditData.plan_small_business_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planSmallBusinessAmountTBC: new FormControl(
      //   this.applicationEditData.plan_small_business_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planUnemploymentDesc: new FormControl(this.applicationEditData.plan_unemployment_desc || ''),
      // planUnemploymentAmount: new FormControl(
      //   this.applicationEditData.plan_unemployment_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planUnemploymentAmountTBC: new FormControl(
      //   this.applicationEditData.plan_unemployment_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planWorkersCompDesc: new FormControl(this.applicationEditData.plan_workers_comp_desc || ''),
      // planWorkersCompAmount: new FormControl(
      //   this.applicationEditData.plan_workers_comp_amount || '',
      //   Validators.pattern(NumberPattern)
      // ),
      // planWorkersCompAmountTBC: new FormControl(
      //   this.applicationEditData.plan_workers_comp_amount_tbc || '',
      //   Validators.pattern(NumberPattern)
      // ),
      planOtherItemsDesc: new FormControl(this.applicationEditData.plan_other_items_desc || ''),
      planOtherItemsAmount: new FormControl(
        this.applicationEditData.plan_other_items_amount || '',
        Validators.pattern(NumberPattern)
      ),
      planOtherItemsAmountTBC: new FormControl(
        this.applicationEditData.plan_other_items_amount_tbc || '',
        Validators.pattern(NumberPattern)
      ),
      workCompletedTotal: new FormControl(
        this.applicationEditData.work_completed_total || 0,
        (control: AbstractControl): any => {
          const amount = +control.value;
          if (typeof amount == 'number' && amount > this.applicantRemainingAmount) {
            return { invalidAmount: true };
          } return null;
        }
      ),
      workToBeCompletedTotal: new FormControl(
        this.applicationEditData.work_to_be_completed_total || 0,
        (control: AbstractControl): any => {
          const amount = +control.value;
          if (typeof amount == 'number' && amount > this.applicantRemainingAmount) {
            return { invalidAmount: true };
          } return null;
        }
      )
    });
  }

  private setupFifthForm() {
    const certify1 = this.applicationEditData.certify_1 && this.applicationEditData.certify_1 === 'True';
    const certify2 = this.applicationEditData.certify_2 && this.applicationEditData.certify_2 === 'True';
    const d = formatDate(new Date(), 'MM/dd/yyyy', 'en');

    this.fifthFormGroup = new FormGroup({
      ceoName: new FormControl(this.applicationEditData.ceo_name || '', Validators.required),
      ceoTitle: new FormControl(this.applicationEditData.ceo_title || '', Validators.required),
      certify1: new FormControl(certify1, (control: AbstractControl): any => {
        if (control.value) return null;
        return { required: true };
      }),
      certify2: new FormControl(certify2, (control: AbstractControl): any => {
        if (control.value) return null;
        return { required: true };
      }),
      dunsNumber: new FormControl(this.dunsNumber, [Validators.required, Validators.pattern(/^\d{9}$/)]),
      status: new FormControl(this.applicationEditData.status || 'Open')//,// not in html
      //dateOfApplicantSubmission: new FormControl(this.applicationEditData.date_of_applicant_submission || d)
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
    if (this.secondFormGroup.valid) {
      console.log('second form values => ', this.secondFormGroup.value);
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.secondFormGroup);
    }
  }

  onStepThreeSubmit() {
    if (this.thirdFormGroup.valid) {
      console.log('third form values => ', this.thirdFormGroup.value);
    } else {
      const workCompletedTotalHasError = this.thirdFormGroup.get('workCompletedTotal').hasError('invalidAmount');
      const workToBeCompletedTotalHasError = this.thirdFormGroup.get('workToBeCompletedTotal').hasError('invalidAmount');
      if (workCompletedTotalHasError || workToBeCompletedTotalHasError) {
        this.toastr.error("Amount exceeds remaining Allocated Amount", "Error");
      } else {
        this.toastr.error("Form is not valid", "Error");
        this.validateAllFormFields(this.thirdFormGroup);
      }
    }
  }

  onStepFourSubmit() {
    if (!this.isCompletedStepFour) {
      this.toastr.error("Form is not valid", "Error");
      return;
    }
    console.log('fourth form values => ', this.documents);
  }

  onStepFiveSubmit() {
    if (this.fifthFormGroup.valid) {
      this.submitApplication();
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.fifthFormGroup);
    }
  }

  private submitApplication() {

    const requiredFields = Constants.APPLICATIONS_MAPPING_REQUIRED;
    const mappingFilds = Constants.APPLICATIONS_MAPPING;

    const formData = Object.assign({},
      this.firstFormGroup.value,
      this.secondFormGroup.value,
      this.thirdFormGroup.value,
      this.fifthFormGroup.value,
    )
    delete formData.dunsNumber;
    const appObject = {};

    for (let key in mappingFilds) {
      let value = mappingFilds[key];
      if (formData[key] || requiredFields.includes(key)) {
        appObject[value] = formData[key];
      }
    }
    if (this.recordId) this.updateApplication(appObject);
    else this.createApplication(appObject);
  }

  private async createApplication(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.doralData.businessApplicationsData.TableId,
        null,
        new Array<FieldListItem>()
      );

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }

      const todayDate = new Date();
      recordFAD.fieldsList.push(new FieldListItem("date_of_entry", todayDate.toDateString(), ""))

      this.loading = true; // Hidden after redirection
      const appResp: any = await this.ignatiusService.postData(recordFAD).toPromise();
      if (!this.dunsNumber) {
        await this.saveDUNS();
      }
      await this.addDocument(appResp.recordId);
      this.applicationFormActionCompleted(true);
    } catch (error) {
      this.applicationFormActionCompleted(false);
    }
  }

  private async saveDUNS() {
    const applicantId = this.storageService.getItem('userSessionData').applicantId;
    const dunsNum = this.fifthFormGroup.get('dunsNumber').value;
    const recordFAD = new FormActionData(0,
      this.doralData.businessApplicationsData.TableId,
      new Where(Number(applicantId)),
      new Array<FieldListItem>()
    );
    recordFAD.fieldsList = [new FieldListItem('duns_number', dunsNum, '')];
    await this.ignatiusService.putData(recordFAD).toPromise();
    this.applicantData.duns_number = dunsNum;
    this.storageService.setItem('userSessionData', this.applicantData);
  }

  private async updateApplication(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.doralData.businessApplicationsData.TableId,
        new Where(Number(this.recordId)),
        new Array<FieldListItem>()
      );
      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }

      this.loading = true;
      await this.ignatiusService.putData(recordFAD).toPromise();
      await this.addDocument(this.recordId);
      await this.deleteDocumentFromDb();
      this.applicationFormActionCompleted(true);
    } catch (error) {
      this.applicationFormActionCompleted(false);
    }
  }

  private applicationFormActionCompleted(success = true) {
    const msg = this.recordId ? 'Updated' : 'Created';
    const err = this.recordId ? 'Updating' : 'Creating';

    if (success) {
      this.toastr.success(`Application ${msg} successfully`, 'Success');
      this.router.navigate(['applications']);
      // this.loading = false;
    } else {
      this.loading = false;
      this.toastr.error(`Error in ${err} Application`, 'Error');
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

  onChangeCostDescription(name: string) {
    const condition = this.getCondition(`${name}Amount`, `${name}AmountTBC`);
    if (!condition) {
      this.toastr.error(`Can't add description without amount`)
      this.thirdFormGroup.get(`${name}Desc`).setValue('');
    }
  }

  onCompletedChange(name: string) {
    const condition = this.getCondition(`${name}Amount`, `${name}AmountTBC`);

    if (condition) {
      this.thirdFormGroup.get(`${name}Desc`).setValidators([Validators.required]);
      this.thirdFormGroup.controls[`${name}Desc`].updateValueAndValidity()
    } else {
      this.thirdFormGroup.get(`${name}Desc`).setValue('');
      this.thirdFormGroup.controls[`${name}Desc`].clearValidators();
      this.thirdFormGroup.controls[`${name}Desc`].updateValueAndValidity()
    }

    this.thirdFormGroup.patchValue({
      workCompletedTotal: this.getTotalWork(this.thirdFormGroup.value, 'CMPLD')
    });

    this.thirdFormStatus = false;
  }

  onToBeCompletedChange(name: string) {

    const condition = this.getCondition(`${name}Amount`, `${name}AmountTBC`);

    if (condition) {
      this.thirdFormGroup.get(`${name}Desc`).setValidators([Validators.required]);
      this.thirdFormGroup.get(`${name}Desc`).updateValueAndValidity();
    } else {
      this.thirdFormGroup.get(`${name}Desc`).setValue('');
      this.thirdFormGroup.get(`${name}Desc`).clearValidators();
      this.thirdFormGroup.get(`${name}Desc`).updateValueAndValidity();
    }

    this.thirdFormGroup.patchValue({
      workToBeCompletedTotal: this.getTotalWork(this.thirdFormGroup.value, 'TBCMPLD')
    });

    this.thirdFormStatus = false;
  }

  getCondition(a, b) {
    const condition = (
      (this.thirdFormGroup.get(a).value && this.thirdFormGroup.get(a).value !== '0') ||
      (this.thirdFormGroup.get(b).value && this.thirdFormGroup.get(b).value !== '0')
    );
    return condition;
  }

  onIntakeChange(name: string, value: string) {
    if (!value) return;

    switch (name) {
      case 'isCovid':
        if (value === 'True') {
          this.firstFormGroup.controls['isCovidComments'].clearValidators();
          this.firstFormGroup.controls['isCovidComments'].updateValueAndValidity()
        }
        if (value === 'False') {
          this.firstFormGroup.get('isCovidComments').setValidators([Validators.required]);
          this.firstFormGroup.controls['isCovidComments'].updateValueAndValidity()
        }
        break;

      case 'isNecessary':
        if (value === 'True') {
          this.firstFormGroup.controls['isNecessaryComments'].clearValidators();
          this.firstFormGroup.controls['isNecessaryComments'].updateValueAndValidity()
        }
        if (value === 'False') {
          this.firstFormGroup.get('isNecessaryComments').setValidators([Validators.required]);
          this.firstFormGroup.controls['isNecessaryComments'].updateValueAndValidity()
        }
        break;

      case 'hasNormalCosts':
        if (value === 'True') {
          this.firstFormGroup.get('hasNormalCostsComments').setValidators([Validators.required]);
          this.firstFormGroup.controls['hasNormalCostsComments'].updateValueAndValidity()
        }
        if (value === 'False') {
          this.firstFormGroup.controls['hasNormalCostsComments'].clearValidators();
          this.firstFormGroup.controls['hasNormalCostsComments'].updateValueAndValidity()
        }
        break;

      case 'hasOtherFunding':
        if (value === 'True') {
          this.firstFormGroup.get('hasOtherFundingComments').setValidators([Validators.required]);
          this.firstFormGroup.controls['hasOtherFundingComments'].updateValueAndValidity()
        }
        if (value === 'False') {
          this.firstFormGroup.controls['hasOtherFundingComments'].clearValidators();
          this.firstFormGroup.controls['hasOtherFundingComments'].updateValueAndValidity()
        }
        break;

      case 'completedOnTime':
        if (value === 'True') {
          this.firstFormGroup.controls['completedOnTimeComments'].clearValidators();
          this.firstFormGroup.controls['completedOnTimeComments'].updateValueAndValidity()
        }
        if (value === 'False') {
          this.firstFormGroup.get('completedOnTimeComments').setValidators([Validators.required]);
          this.firstFormGroup.controls['completedOnTimeComments'].updateValueAndValidity()
        }
        break;

      default:
        break;
    }

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

  private getTotalWork(obj, key: string) {
    let keys;
    let sum = 0;

    switch (key) {
      case 'CMPLD':
        keys = Constants.COMPLETED_WORk_KEYS;
        break;

      case 'TBCMPLD':
        keys = Constants.TO_BE_COMPLETED_WORK_KEYS;
        break;
    }
    for (const iterator of keys) {
      if (!Number(obj[iterator])) continue;
      sum += obj[iterator] ? Number(obj[iterator]) : 0;
    }

    return sum;
  }

  async addDocument(applicationId) {
    try {

      const observables = [];

      for (const iterator of this.documents) {

        const tempId = iterator['tempId'];

        if (!iterator[`document_${tempId}`]) continue;

        const documentType = iterator[`documentType_${tempId}`];
        const documentTitle = iterator[`documentTitle_${tempId}`];
        const document = iterator[`document_${tempId}`];
        const fileName = iterator[`fileName_${tempId}`];

        const condition = (
          !iterator[`document_${tempId}`] ||
          !iterator[`documentTitle_${tempId}`] ||
          !iterator[`documentType_${tempId}`]
        )

        if (condition) continue;

        const recordFAD = new FormActionData(0,
          this.doralData.documentsData.TableId,
          null,
          new Array<FieldListItem>()
        );

        recordFAD.fieldsList.push(new FieldListItem(
          'related_applicants',
          (this.storageService.getItem('userSessionData')).applicantId,
          '')
        )
        recordFAD.fieldsList.push(new FieldListItem('document_type', 'Application Attachment', ''))
        recordFAD.fieldsList.push(new FieldListItem('document_type_selection', documentType, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_title', documentTitle, ''))
        recordFAD.fieldsList.push(new FieldListItem('related_applications', applicationId, ''))
        recordFAD.fieldsList.push(new FieldListItem('document', fileName, document)
        )

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

  onChangeDocumentType(tempId, type) {
    for (const iterator of this.documents) {
      if (iterator.tempId === tempId) {
        iterator[`documentType_${tempId}`] = type;
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

    this.documentTypes[tempId] = "";
    this.documentTitles[tempId] = "";

    this.documents.push(obj);
  }

  removeDocumentRow(tempId) {
    const index = this.documents.findIndex(x => x.tempId === tempId);
    this.documents.splice(index, 1);
    if (this.documents.length === 0) this.isCompletedStepFour = true;
    else this.validateDocumentForm();
  }

  downloadFile(file: any) {
    // NES - FOR NOW
    // this.ignatiusService.downloadFile(
    //   this.doralData.documentsData.TableId,
    //   file["id"],
    //   this.doralData.documentsData.DocumentFileId,
    //   file["document"]
    // );
  }

  deleteDocument(docId) {
    this.deletedDocuments.push(docId);
    this.applicationEditDocumentData = this.applicationEditDocumentData.filter(
      iterator => iterator.id !== docId
    )
  }

  private validateDocumentForm() {
    let status = true;
    for (const iterator of this.documents) {
      let tempId = iterator['tempId'];

      const condition = (
        !iterator[`document_${tempId}`] ||
        !iterator[`documentTitle_${tempId}`] ||
        !iterator[`documentType_${tempId}`]
      )

      if (condition) {
        status = false;
        break;
      }
    }
    this.isCompletedStepFour = Boolean(this.documents.length === 0) || status;
  }

  private async deleteDocumentFromDb() {
    try {
      if (this.deletedDocuments.length === 0) return;

      const observables = [];
      for (let id of this.deletedDocuments) {
        const formActionData =
          new FormActionData(
            0,
            this.doralData.documentsData.TableId,
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

  cancelChanges(content) {
    const isFormDirty = this.firstFormGroup.dirty || this.secondFormGroup.dirty
      || this.thirdFormGroup || this.firstFormGroup.dirty;

    if (isFormDirty) {
      this.modelConfig = new PopupModel();
      this.modelConfig.title = 'Confirmation';
      this.modelConfig.settings.size = 'sm';
      this.ngbModal.open(content, this.modelConfig.settings)
    } else {
      this.redirectToApps();
    }
  }

  redirectToApps(closeModal = false) {
    closeModal && this.ngbModal.dismissAll();
    this.router.navigate(['applications']);
  }

  verfyThridForm() {
    if (!this.thirdFormGroup.valid) {
      const workCompletedTotalHasError = this.thirdFormGroup.get('workCompletedTotal').hasError('invalidAmount');
      const workToBeCompletedTotalHasError = this.thirdFormGroup.get('workToBeCompletedTotal').hasError('invalidAmount');
      if (workCompletedTotalHasError || workToBeCompletedTotalHasError) {
        this.toastr.error("Amount exceeds remaining Allocated Amount", "Error");
      } else {
        this.toastr.error("Form is not valid", "Error");
        this.validateAllFormFields(this.thirdFormGroup);
      }
      return;
    }

    const sum = Number(this.thirdFormGroup.get('workCompletedTotal').value) +
      Number(this.thirdFormGroup.get('workToBeCompletedTotal').value);

    if (sum > this.applicantRemainingAmount) {
      this.toastr.error("Amount exceeds remaining Allocated Amount", "Error");
      return;
    }
    this.thirdFormStatus = true;

  }

}

