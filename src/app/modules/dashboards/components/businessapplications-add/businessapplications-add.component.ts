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
  businessApplicationEditData: any;
  documentSelectionTypes: Array<any>;
  organizationTypes: Array<any>;
  ownOrLease: Array<any>;
  businessApplicationEditDocumentData: any;

  //applicantList: Array<{ id: string, name: string }>;
  doralData = this.projectSpecificService.getProjectSpecificData();


  documents: Array<any> = [];
  deletedDocuments: Array<any> = [];
  documentTypes = {
  };
  documentTitles = {};
  isCompletedStepSeven: boolean = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  eighthFormGroup: FormGroup;
  modelConfig: PopupModel;
  programData: any;

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
    this.organizationTypes = componentData[0];
    this.ownOrLease = componentData[1];
    this.documentSelectionTypes = componentData[2];
    this.businessApplicationEditData = (componentData && componentData[3]) ? componentData[3][0] : {};
    this.businessApplicationEditDocumentData = (componentData && componentData[4]) ? componentData[4] : [];
    this.setupForm();
    this.spinner.hide();
  }

  private setupForm() {
    this.setupFirstForm();
    this.setupSecondForm();
    this.setupThirdForm();
    this.setupFourthForm();
    this.setupFifthForm();
    this.setupSixthForm();
    this.setupSeventhForm();
    this.setupEighthForm();
  }

  private setupFirstForm() {
    this.firstFormGroup = new FormGroup({

    });
  }

  private setupSecondForm() {
    this.secondFormGroup = new FormGroup({
      primary_applicant: new FormControl(this.businessApplicationEditData.primary_applicant || ''),// Validators.required),
      home_address: new FormControl(this.businessApplicationEditData.home_address || ''),// Validators.required),
      email: new FormControl(this.businessApplicationEditData.email || ''),// [Validators.required, Validators.email]),
      phone: new FormControl(this.businessApplicationEditData.phone || ''),// [Validators.required, Validators.pattern("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$")])
    });
  }

  private setupThirdForm() {
    this.thirdFormGroup = new FormGroup({
      organization_type: new FormControl(this.businessApplicationEditData.organization_type || ''),// Validators.required),
      business_legal_name: new FormControl(this.businessApplicationEditData.business_legal_name || ''),// Validators.required),
      dba: new FormControl(this.businessApplicationEditData.dba || ''),//, Validators.required),
      ein: new FormControl(this.businessApplicationEditData.ein || ''),//, Validators.required),
      btr: new FormControl(this.businessApplicationEditData.btr || ''),//, Validators.required),
      mailing_address: new FormControl(this.businessApplicationEditData.mailing_address || ''),//, Validators.required),
      business_property_address: new FormControl(this.businessApplicationEditData.business_property_address || ''),//, Validators.required),
      business_activity: new FormControl(this.businessApplicationEditData.business_activity || ''),//, Validators.required)
    });
  }

  private setupFourthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    const dateBusinessEstablished = (this.businessApplicationEditData.date_business_established)
      ? new Date(this.businessApplicationEditData.date_business_established).toISOString().split('T')[0]
      : null

    const lastRentMortgagePaid = (this.businessApplicationEditData.last_rent_mortgage_paid)
      ? new Date(this.businessApplicationEditData.last_rent_mortgage_paid).toISOString().split('T')[0]
      : null

    this.fourthFormGroup = new FormGroup({
      number_of_employees_last_year: new FormControl(this.businessApplicationEditData.number_of_employees_last_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      number_of_employees_current: new FormControl(this.businessApplicationEditData.number_of_employees_current || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      date_business_established: new FormControl(dateBusinessEstablished),//, Validators.required),
      own_or_lease: new FormControl(this.businessApplicationEditData.own_or_lease || ''),//, Validators.required),
      monthly_rent_mortgage: new FormControl(this.businessApplicationEditData.monthly_rent_mortgage || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      last_rent_mortgage_paid: new FormControl(lastRentMortgagePaid),//, Validators.required),
      national_chain_or_franchise: new FormControl(this.businessApplicationEditData.national_chain_or_franchise || ''),//, Validators.required)
    });
  }

  private setupFifthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    this.fifthFormGroup = new FormGroup({
      applicant1_name: new FormControl(this.businessApplicationEditData.applicant1_name || ''),//, Validators.required),
      applicant2_name: new FormControl(this.businessApplicationEditData.applicant2_name || ''),
      applicant3_name: new FormControl(this.businessApplicationEditData.applicant3_name || ''),
      applicant4_name: new FormControl(this.businessApplicationEditData.applicant4_name || ''),
      applicant1_ownership_percentage: new FormControl(this.businessApplicationEditData.applicant1_ownership_percentage || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      applicant2_ownership_percentage: new FormControl(this.businessApplicationEditData.applicant2_ownership_percentage || '', Validators.pattern(NumberPattern)),
      applicant3_ownership_percentage: new FormControl(this.businessApplicationEditData.applicant3_ownership_percentage || '', Validators.pattern(NumberPattern)),
      applicant4_ownership_percentage: new FormControl(this.businessApplicationEditData.applicant4_ownership_percentage || '', Validators.pattern(NumberPattern)),
    });
  }

  private setupSixthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    this.sixthFormGroup = new FormGroup({
      amount_requested: new FormControl(this.businessApplicationEditData.amount_requested || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      estimated_loss: new FormControl(this.businessApplicationEditData.estimated_loss || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      gross_revenue_last_year: new FormControl(this.businessApplicationEditData.gross_revenue_last_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      gross_revenue_this_year: new FormControl(this.businessApplicationEditData.gross_revenue_this_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      payroll_last_year: new FormControl(this.businessApplicationEditData.payroll_last_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      payroll_this_year: new FormControl(this.businessApplicationEditData.payroll_this_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      pre_tax_profit_last_year: new FormControl(this.businessApplicationEditData.pre_tax_profit_last_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      pre_tax_profit_this_year: new FormControl(this.businessApplicationEditData.pre_tax_profit_this_year || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      costs_to_recover: new FormControl(this.businessApplicationEditData.costs_to_recover || ''),//, Validators.required),
    });
  }

  private setupSeventhForm() {

  }

  private setupEighthForm() {
    const certify = this.businessApplicationEditData.certify === 'True';
    const d = formatDate(new Date(), 'MM/dd/yyyy', 'en');

    const userData = this.storageService.getItem('userData');

    this.eighthFormGroup = new FormGroup({
      // certifier_name: new FormControl(this.businessApplicationEditData.certifier_name || '', Validators.required),
      // certifier_title: new FormControl(this.businessApplicationEditData.certifier_title || '', Validators.required),
      // certify: new FormControl(certify, (control: AbstractControl): any => {
      //   if (control.value) return null;
      //   return { required: true };
      // }),
      status: new FormControl(this.businessApplicationEditData.status || 'Open'),
      email_user: new FormControl(userData.userName),
      related_programs: new FormControl(this.businessApplicationEditData.related_programs || '2')
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
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.thirdFormGroup);
    }
  }

  onStepFourSubmit() {
    if (this.fourthFormGroup.valid) {
      console.log('fourth form values => ', this.fourthFormGroup.value);
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.fourthFormGroup);
    }
  }

  onStepFiveSubmit() {
    if (this.fifthFormGroup.valid) {
      console.log('fifth form values => ', this.fifthFormGroup.value);
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.fifthFormGroup);
    }
  }

  onStepSixSubmit() {
    if (this.sixthFormGroup.valid) {
      console.log('sixth form values => ', this.sixthFormGroup.value);
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.sixthFormGroup);
    }
  }

  onStepSevenSubmit() {
    if (!this.isCompletedStepSeven) {
      this.toastr.error("Form is not valid", "Error");
      return;
    }
    console.log('seventh form values => ', this.documents);
  }

  onStepEightSubmit() {
    if (this.eighthFormGroup.valid) {
      this.submitBusinessApplication();
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.eighthFormGroup);
    }
  }

  private submitBusinessApplication() {

    const requiredFields = Constants.BUSINESS_APPLICATIONS_MAPPING_REQUIRED;
    const mappingFilds = Constants.BUSINESS_APPLICATIONS_MAPPING;

    const formData = Object.assign({},
      this.firstFormGroup.value,
      this.secondFormGroup.value,
      this.thirdFormGroup.value,
      this.fourthFormGroup.value,
      this.fifthFormGroup.value,
      this.sixthFormGroup.value,
      //this.seventhFormGroup.value,
      this.eighthFormGroup.value,
    )
    delete formData.dunsNumber;
    const appObject = {};

    for (let key in mappingFilds) {
      let value = mappingFilds[key];
      if (formData[key] || requiredFields.includes(key)) {
        appObject[value] = formData[key];
      }
    }
    if (this.recordId) this.updateBusinessApplication(appObject);
    else this.createBusinessApplication(appObject);
  }

  private async createBusinessApplication(appObject) {
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

      this.spinner.show();
      const appResp: any = await this.ignatiusService.postData(recordFAD).toPromise();
      await this.addDocument(appResp.recordId);
      this.businessApplicationFormActionCompleted(true);
    } catch (error) {
      this.businessApplicationFormActionCompleted(false);
    }
  }

  private async updateBusinessApplication(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.doralData.businessApplicationsData.TableId,
        new Where(Number(this.recordId)),
        new Array<FieldListItem>()
      );
      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }

      this.spinner.show();
      await this.ignatiusService.putData(recordFAD).toPromise();
      await this.addDocument(this.recordId);
      await this.deleteDocumentFromDb();
      this.businessApplicationFormActionCompleted(true);
    } catch (error) {
      this.businessApplicationFormActionCompleted(false);
    }
  }

  private businessApplicationFormActionCompleted(success = true) {
    const msg = this.recordId ? 'Updated' : 'Created';
    const err = this.recordId ? 'Updating' : 'Creating';

    if (success) {
      this.toastr.success(`Business Application ${msg} successfully`, 'Success');
      this.router.navigate(['dashboard']);
    } else {
      this.spinner.hide();
      this.toastr.error(`Error in ${err} Business Application`, 'Error');
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
          // !iterator[`documentTitle_${tempId}`] || (Not required)
          !iterator[`documentType_${tempId}`]
        )

        if (condition) continue;

        const recordFAD = new FormActionData(0,
          this.doralData.documentsData.TableId,
          null,
          new Array<FieldListItem>()
        );

        recordFAD.fieldsList.push(new FieldListItem('document_type', 'Business Application', ''))
        recordFAD.fieldsList.push(new FieldListItem('related_required_documents', documentType, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_title', documentTitle, ''))
        recordFAD.fieldsList.push(new FieldListItem('related_business_assistance', applicationId, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_file', fileName, document)
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

    // if (this.documents.length === 5) {
    //   this.toastr.error('Cant add more then 5 rows', 'Error');
    //   return
    // }

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
    if (this.documents.length === 0) this.isCompletedStepSeven = true;
    else this.validateDocumentForm();
  }

  downloadFile(file: any) {
    this.ignatiusService.downloadFile(
      this.doralData.documentsData.TableId,
      file["id"],
      this.doralData.documentsData.RecordIdFieldId,
      file["document_file"]
    );
  }

  deleteDocument(docId) {
    this.deletedDocuments.push(docId);
    this.businessApplicationEditDocumentData = this.businessApplicationEditDocumentData.filter(
      iterator => iterator.id !== docId
    )
  }

  private validateDocumentForm() {
    let status = true;
    for (const iterator of this.documents) {
      let tempId = iterator['tempId'];

      const condition = (
        !iterator[`document_${tempId}`] ||
        // !iterator[`documentTitle_${tempId}`] || (Not required)
        !iterator[`documentType_${tempId}`]
      )

      if (condition) {
        status = false;
        break;
      }
    }
    this.isCompletedStepSeven = Boolean(this.documents.length === 0) || status;
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
      || this.thirdFormGroup || this.fourthFormGroup.dirty || this.fifthFormGroup.dirty
      || this.sixthFormGroup.dirty || this.seventhFormGroup.dirty || this.eighthFormGroup.dirty;

    if (isFormDirty) {
      this.modelConfig = new PopupModel();
      this.modelConfig.title = 'Confirmation / Confirmación';
      this.modelConfig.settings.size = 'lg';
      this.ngbModal.open(content, this.modelConfig.settings)
    } else {
      this.redirectToApps();
    }
  }

  redirectToApps(closeModal = false) {
    closeModal && this.ngbModal.dismissAll();
    this.router.navigate(['dashboard']);
  }

  saveExit(fmGrp: string) {

    if (!fmGrp) {
      this.submitBusinessApplication();
      return;
    }

    if (this[fmGrp].valid) {
      this.submitBusinessApplication();
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.firstFormGroup);
    }
  }

}

