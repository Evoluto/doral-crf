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
  selector: 'app-rentalapplications-add',
  templateUrl: './rentalapplications-add.component.html',
  styleUrls: ['./rentalapplications-add.component.css']
})
export class RentalApplicationsAddComponent implements OnInit {

  recordId: string;
  rentalApplicationEditData: any;
  documentSelectionTypes: Array<any>;
  rentalApplicationEditDocumentData: any;

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
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.documentSelectionTypes = componentData[0];
    this.rentalApplicationEditData = (componentData && componentData[1]) ? componentData[1][0] : {};
    this.rentalApplicationEditDocumentData = (componentData && componentData[2]) ? componentData[2] : [];
    this.rentalApplicationEditDocumentData = this.rentalApplicationEditDocumentData.filter(
      iterator => iterator.document_type === "Application Attachment"
    )
    //this.programData = this.storageService.getItem('userSessionData');
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
      primary_applicant: new FormControl(this.rentalApplicationEditData.primary_applicant || '', Validators.required),
      home_address: new FormControl(this.rentalApplicationEditData.home_address || '', Validators.required),
      email: new FormControl(this.rentalApplicationEditData.email || '', [Validators.required, Validators.email]),
      phone: new FormControl(this.rentalApplicationEditData.phone || '', [Validators.required, Validators.pattern("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$")])
    });
  }

  private setupThirdForm() {
    this.thirdFormGroup = new FormGroup({
      organization_type: new FormControl(this.rentalApplicationEditData.organization_type || '', Validators.required),
      rental_legal_name: new FormControl(this.rentalApplicationEditData.rental_legal_name || '', Validators.required),
      dba: new FormControl(this.rentalApplicationEditData.dba || '', Validators.required),
      ein: new FormControl(this.rentalApplicationEditData.ein || '', Validators.required),
      btr: new FormControl(this.rentalApplicationEditData.btr || '', Validators.required),
      mailing_address: new FormControl(this.rentalApplicationEditData.mailing_address || '', Validators.required),
      rental_property_address: new FormControl(this.rentalApplicationEditData.rental_property_address || '', Validators.required),
      rental_activity: new FormControl(this.rentalApplicationEditData.rental_activity || '', Validators.required)
    });
  }

  private setupFourthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    this.fourthFormGroup = new FormGroup({
      number_of_employees_last_year: new FormControl(this.rentalApplicationEditData.number_of_employees_last_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      number_of_employees_current: new FormControl(this.rentalApplicationEditData.number_of_employees_current || '', [Validators.required,Validators.pattern(NumberPattern)]),
      date_rental_established: new FormControl(this.rentalApplicationEditData.date_rental_established || '', Validators.required),
      own_or_lease: new FormControl(this.rentalApplicationEditData.own_or_lease || '', Validators.required),
      monthly_rent_mortgage: new FormControl(this.rentalApplicationEditData.monthly_rent_mortgage || '', [Validators.required,Validators.pattern(NumberPattern)]),
      last_rent_mortgage_paid: new FormControl(this.rentalApplicationEditData.last_rent_mortgage_paid || '', Validators.required),
      national_chain_or_franchise: new FormControl(this.rentalApplicationEditData.national_chain_or_franchise || '', Validators.required)
    });
  }

  private setupFifthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    this.fifthFormGroup = new FormGroup({
      applicant1_name: new FormControl(this.rentalApplicationEditData.applicant1_name || '', Validators.required),
      applicant2_name: new FormControl(this.rentalApplicationEditData.applicant2_name || ''),
      applicant3_name: new FormControl(this.rentalApplicationEditData.applicant3_name || ''),
      applicant4_name: new FormControl(this.rentalApplicationEditData.applicant4_name || ''),
      applicant1_ownership_percentage: new FormControl(this.rentalApplicationEditData.applicant1_ownership_percentage || '', [Validators.required,Validators.pattern(NumberPattern)]),
      applicant2_ownership_percentage: new FormControl(this.rentalApplicationEditData.applicant2_ownership_percentage || '', Validators.pattern(NumberPattern)),
      applicant3_ownership_percentage: new FormControl(this.rentalApplicationEditData.applicant3_ownership_percentage || '', Validators.pattern(NumberPattern)),
      applicant4_ownership_percentage: new FormControl(this.rentalApplicationEditData.applicant4_ownership_percentage || '', Validators.pattern(NumberPattern)),
    });
  }

  private setupSixthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;

    this.sixthFormGroup = new FormGroup({
      amount_requested: new FormControl(this.rentalApplicationEditData.amount_requested || '', [Validators.required,Validators.pattern(NumberPattern)]),
      estimated_loss: new FormControl(this.rentalApplicationEditData.estimated_loss || '', [Validators.required,Validators.pattern(NumberPattern)]),
      gross_revenue_last_year: new FormControl(this.rentalApplicationEditData.gross_revenue_last_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      gross_revenue_this_year: new FormControl(this.rentalApplicationEditData.gross_revenue_this_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      payroll_last_year: new FormControl(this.rentalApplicationEditData.payroll_last_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      payroll_this_year: new FormControl(this.rentalApplicationEditData.payroll_this_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      pre_tax_profit_last_year: new FormControl(this.rentalApplicationEditData.pre_tax_profit_last_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      pre_tax_profit_this_year: new FormControl(this.rentalApplicationEditData.pre_tax_profit_this_year || '', [Validators.required,Validators.pattern(NumberPattern)]),
      costs_to_recover: new FormControl(this.rentalApplicationEditData.costs_to_recover || '', Validators.required),
    });
  }

  private setupSeventhForm() {

  }

  private setupEighthForm() {
    const certify = this.rentalApplicationEditData.certify_1 && this.rentalApplicationEditData.certify_1 === 'True';
    const d = formatDate(new Date(), 'MM/dd/yyyy', 'en');

    this.eighthFormGroup = new FormGroup({
      certifier_name: new FormControl(this.rentalApplicationEditData.certifier_name || '', Validators.required),
      certifier_title: new FormControl(this.rentalApplicationEditData.certifier_title || '', Validators.required),
      certify: new FormControl(certify, (control: AbstractControl): any => {
        if (control.value) return null;
        return { required: true };
      }),
      status: new FormControl(this.rentalApplicationEditData.status || 'Open')//,// not in html
      //dateOfApplicantSubmission: new FormControl(this.rentalApplicationEditData.date_of_applicant_submission || d)
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
      this.submitRentalApplication();
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.eighthFormGroup);
    }
  }

  private submitRentalApplication() {

    const requiredFields = Constants.APPLICATIONS_MAPPING_REQUIRED;
    const mappingFilds = Constants.APPLICATIONS_MAPPING;

    const formData = Object.assign({},
      this.firstFormGroup.value,
      this.secondFormGroup.value,
      this.thirdFormGroup.value,
      this.fourthFormGroup.value,
      this.fifthFormGroup.value,
      this.sixthFormGroup.value,
      this.seventhFormGroup.value,
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
    if (this.recordId) this.updateRentalApplication(appObject);
    else this.createRentalApplication(appObject);
  }

  private async createRentalApplication(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.doralData.rentalApplicationsData.TableId,
        null,
        new Array<FieldListItem>()
      );

      for (let key in appObject) {
        recordFAD.fieldsList.push(new FieldListItem(key, appObject[key], ""))
      }

      const todayDate = new Date();

      this.loading = true; // Hidden after redirection
      const appResp: any = await this.ignatiusService.postData(recordFAD).toPromise();
      await this.addDocument(appResp.recordId);
      this.rentalApplicationFormActionCompleted(true);
    } catch (error) {
      this.rentalApplicationFormActionCompleted(false);
    }
  }

  private async updateRentalApplication(appObject) {
    try {
      const recordFAD = new FormActionData(0,
        this.doralData.rentalApplicationsData.TableId,
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
      this.rentalApplicationFormActionCompleted(true);
    } catch (error) {
      this.rentalApplicationFormActionCompleted(false);
    }
  }

  private rentalApplicationFormActionCompleted(success = true) {
    const msg = this.recordId ? 'Updated' : 'Created';
    const err = this.recordId ? 'Updating' : 'Creating';

    if (success) {
      this.toastr.success(`Application ${msg} successfully`, 'Success');
      this.router.navigate(['rentalapplications']);
      // this.loading = false;
    } else {
      this.loading = false;
      this.toastr.error(`Error in ${err} Rental Application`, 'Error');
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
    if (this.documents.length === 0) this.isCompletedStepSeven = true;
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
    this.rentalApplicationEditDocumentData = this.rentalApplicationEditDocumentData.filter(
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
      this.modelConfig.title = 'Confirmation';
      this.modelConfig.settings.size = 'sm';
      this.ngbModal.open(content, this.modelConfig.settings)
    } else {
      this.redirectToApps();
    }
  }

  redirectToApps(closeModal = false) {
    closeModal && this.ngbModal.dismissAll();
    this.router.navigate(['rentalapplications']);
  }

}
