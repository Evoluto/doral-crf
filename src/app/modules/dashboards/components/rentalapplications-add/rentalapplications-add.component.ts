import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
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
import { forkJoin, Subscription, Subject, Observable } from 'rxjs';
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
  landlordDocumentSelectionTypes: Array<any>;
  applicantsDocumentSelectionTypes: Array<any>;
  applicantEditDocumentData: any;
  landlordEditDocumentData: any;
  householdEditdata: Array<any>;

  //applicantList: Array<{ id: string, name: string }>;
  doralData = this.projectSpecificService.getProjectSpecificData();

  landlordDocuments: Array<any> = [];
  deletedLandlordDocuments: Array<any> = [];
  landlordDocumentTypes = {};
  landlordDocumentTitles = {};

  applicantDocuments: Array<any> = [];
  deletedApplicantDocuments: Array<any> = [];
  applicantDocumentTypes = {};
  applicantDocumentTitles = {};

  isCompletedStepFour: boolean = true;
  isCompletedStepSix: boolean = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  //seventhFormGroup: FormGroup;
  eighthFormGroup: FormGroup;
  modelConfig: PopupModel;
  programData: any;

  private householdSizeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private ignatiusService: IgnatiusService,
    private storageService: StorageService,
    private projectSpecificService: ProjectSpecificService,
    private formBuilder: FormBuilder,
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.applicantsDocumentSelectionTypes = this.getDocumentTypes(componentData[0], 'Applicant');
    this.landlordDocumentSelectionTypes = this.getDocumentTypes(componentData[0], 'Landlord');
    this.rentalApplicationEditData = (componentData && componentData[1]) ? componentData[1][0] : {};
    const documentEditdata = (componentData && componentData[2]) ? componentData[2] : [];
    this.householdEditdata = (componentData && componentData[3]) ? componentData[3] : [];
    this.applicantEditDocumentData = this.getDocumentEditData(documentEditdata, 'Rental Application Applicant');
    this.landlordEditDocumentData = this.getDocumentEditData(documentEditdata, 'Rental Application Landlord');
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
    //this.setupSeventhForm();
    this.setupEighthForm();
  }

  private setupFirstForm() {
    this.firstFormGroup = new FormGroup({

    });
  }

  private setupSecondForm() {
    const PhonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    const SSNumPattern = /^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$/;

    this.secondFormGroup = new FormGroup({
      applicant_name: new FormControl(this.rentalApplicationEditData.applicant_name || ''),//, Validators.required),
      applicant_ss_num: new FormControl(this.rentalApplicationEditData.applicant_ss_num || ''),//, [Validators.required, Validators.pattern("^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$")]),
      co_applicant_name: new FormControl(this.rentalApplicationEditData.co_applicant_name || ''),//, Validators.required),
      co_applicant_ss_num: new FormControl(this.rentalApplicationEditData.co_applicant_ss_num || ''),//,  [Validators.required, Validators.pattern("^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$")]),
      address: new FormControl(this.rentalApplicationEditData.address || ''),//, Validators.required),
      email: new FormControl(this.rentalApplicationEditData.email || ''),//, [Validators.required, Validators.email]),
      phone: new FormControl(this.rentalApplicationEditData.phone || ''),//, [Validators.required, Validators.pattern(PhonePattern)])
      amount_requested: new FormControl(this.rentalApplicationEditData.amount_requested || '')//, [Validators.required,Validators.pattern(DecimalNumberPattern)]),
    });
  }


  private setupThirdForm() {
    // const PhonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    // const SSNumPattern = /^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$/;

    this.thirdFormGroup = this.formBuilder.group({
      household_size: new FormControl(
        this.rentalApplicationEditData.household_size || "",
        [Validators.required, Validators.pattern("^[1-9]*$")]
      ),
      items: this.formBuilder.array([])
    });

    this.householdSizeSubscription = this.thirdFormGroup.get('household_size')
      .valueChanges
      .subscribe(value => {
        this.onHouseholdSizeChange(value)
      })

    this.getExistingHouseHoldData();
  }

  private setupFourthForm() {

  }

  private setupFifthForm() {
    const NumberPattern = /^\d{1,8}(?:\.\d{1,2})?$/;
    const PhonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

    this.fifthFormGroup = new
      FormGroup({
        landlord: new FormControl(this.rentalApplicationEditData.landlord || ''),//, Validators.required),
        landlord_authorized_representative: new FormControl(this.rentalApplicationEditData.landlord_authorized_representative || ''),
        landlord_address: new FormControl(this.rentalApplicationEditData.landlord_address || ''),
        landlord_email: new FormControl(this.rentalApplicationEditData.landlord_email || ''),//, [Validators.required, Validators.email]),
        landlord_phone: new FormControl(this.rentalApplicationEditData.landlord_phone || ''),//, [Validators.required, Validators.pattern(PhonePattern)])
      });
  }

  private setupSixthForm() {

  }

  private setupSeventhForm() {

  }

  private setupEighthForm() {
    const certify = this.rentalApplicationEditData.certify === 'True';
    const d = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    const userData = this.storageService.getItem('userData');

    this.eighthFormGroup = new FormGroup({
      // certifier_name: new FormControl(this.rentalApplicationEditData.certifier_name || '', Validators.required),
      // //certifier_title: new FormControl(this.rentalApplicationEditData.certifier_title || '', Validators.required),
      // certify: new FormControl(certify, (control: AbstractControl): any => {
      //   i  f (control.value) return null;
      //   return { required: true };
      // }),
      status: new FormControl(this.rentalApplicationEditData.status || 'Open'),
      email_user: new FormControl(userData.userName),
      related_programs: new FormControl(this.rentalApplicationEditData.related_programs || '1')
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
    if (!this.isCompletedStepFour) {
      this.toastr.error("Form is not valid", "Error");
      return;
    }
    console.log('fourth form values => ', this.landlordDocuments);
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
    if (!this.isCompletedStepSix) {
      this.toastr.error("Form is not valid", "Error");
      return;
    }
    console.log('sixth form values => ', this.landlordDocuments);
  }

  onStepSevenSubmit() {
    // if (!this.isCompletedStepSeven) {
    //   this.toastr.error("Form is not valid", "Error");
    //   return;
    // }
    // console.log('seventh form values => ', this.landlordDocuments);
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

    const requiredFields = Constants.RENTAL_APPLICATIONS_MAPPING_REQUIRED;
    const mappingFields = Constants.RENTAL_APPLICATIONS_MAPPING;

    const formData = Object.assign({},
      this.firstFormGroup.value,
      this.secondFormGroup.value,
      this.thirdFormGroup.value,
      //this.fourthFormGroup.value, /////(because Documents)
      this.fifthFormGroup.value,
      //this.sixthFormGroup.value, /////(because Documents)
      //this.seventhFormGroup.value,
      this.eighthFormGroup.value,
    )
    const appObject = {};

    for (let key in mappingFields) {
      let value = mappingFields[key];
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

      this.spinner.show();
      const appResp: any = await this.ignatiusService.postData(recordFAD).toPromise();
      await this.addDocument(appResp.recordId);
      await this.submitHousehold(appResp.recordId);
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

      this.spinner.show();
      await this.ignatiusService.putData(recordFAD).toPromise();
      await this.addDocument(this.recordId);
      await this.submitHousehold(this.recordId);
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
      this.toastr.success(`Rental Application ${msg} successfully`, 'Success');
      this.router.navigate(['dashboard']);
    } else {
      this.spinner.hide();
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

  cancelChanges(content) {
    const isFormDirty = this.firstFormGroup.dirty || this.secondFormGroup.dirty
      || this.thirdFormGroup || this.fourthFormGroup.dirty
      || this.fifthFormGroup.dirty || this.sixthFormGroup.dirty
      //|| this.seventhFormGroup.dirty 
      || this.eighthFormGroup.dirty;

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
      this.submitRentalApplication();
      return;
    }

    if (this[fmGrp].valid) {
      this.submitRentalApplication();
    } else {
      this.toastr.error("Form is not valid", "Error");
      this.validateAllFormFields(this.firstFormGroup);
    }
  }




  /*================================== Documents section Start ==================================*/

  getDocumentTypes(data: Array<any>, type: string): Array<any> {
    if (data.length === 0) return [];
    return data.filter(elem => elem.required_from === type)
  }

  getDocumentEditData(data: Array<any>, type: string): Array<any> {
    if (data.length === 0) return [];
    return data.filter(elem => elem.document_type === type)
  }

  addDocumentFormRow(type: string) {
    let obj = {};
    let tempId = uuid.v4();

    obj['tempId'] = tempId;
    obj[`document_${tempId}`] = "";
    obj[`fileName_${tempId}`] = "";
    obj[`documentTitle_${tempId}`] = "";

    switch (type) {
      case 'Landlord':
        this.landlordDocumentTypes[tempId] = "";
        this.landlordDocumentTitles[tempId] = "";
        this.landlordDocuments.push(obj);
        break;

      case 'Applicant':
        this.applicantDocumentTypes[tempId] = "";
        this.applicantDocumentTitles[tempId] = "";
        this.applicantDocuments.push(obj);
        break;

      default:
        break;
    }

  }

  removeLandlordDocumentRow(tempId) {
    const index = this.landlordDocuments.findIndex(x => x.tempId === tempId);
    this.landlordDocuments.splice(index, 1);
    if (this.landlordDocuments.length === 0) this.isCompletedStepFour = true; //[TODO]
    else this.validateLandlordDocumentForm();
  }

  removeApplicantDocumentRow(tempId) {
    const index = this.applicantDocuments.findIndex(x => x.tempId === tempId);
    this.applicantDocuments.splice(index, 1);
    if (this.applicantDocuments.length === 0) this.isCompletedStepSix = true; //[TODO]
    else this.validateApplicantDocumentForm();
  }

  onChangeLandlordDocumentTitle(tempId, title) {
    for (const iterator of this.landlordDocuments) {
      if (iterator.tempId === tempId) {
        iterator[`documentTitle_${tempId}`] = title;
        break;
      }
    }
    this.validateLandlordDocumentForm();
  }

  onChangeApplicantDocumentTitle(tempId, title) {
    for (const iterator of this.applicantDocuments) {
      if (iterator.tempId === tempId) {
        iterator[`documentTitle_${tempId}`] = title;
        break;
      }
    }
    this.validateApplicantDocumentForm();
  }

  onChangeLandlordDocumentType(tempId, type) {
    for (const iterator of this.landlordDocuments) {
      if (iterator.tempId === tempId) {
        iterator[`documentType_${tempId}`] = type;
        break;
      }
    }
    this.validateLandlordDocumentForm();
  }

  onChangeApplicantDocumentType(tempId, type) {
    for (const iterator of this.applicantDocuments) {
      if (iterator.tempId === tempId) {
        iterator[`documentType_${tempId}`] = type;
        break;
      }
    }
    this.validateApplicantDocumentForm();
  }


  deleteLandlordDocument(docId) {
    this.deletedLandlordDocuments.push(docId);
    this.landlordEditDocumentData = this.landlordEditDocumentData.filter(
      iterator => iterator.id !== docId
    )
  }

  deleteApplicantDocument(docId) {
    this.deletedApplicantDocuments.push(docId);
    this.applicantEditDocumentData = this.applicantEditDocumentData.filter(
      iterator => iterator.id !== docId
    )
  }

  private validateLandlordDocumentForm() {
    let status = true;
    for (const iterator of this.landlordDocuments) {
      let tempId = iterator['tempId'];

      const condition = (
        !iterator[`document_${tempId}`] ||
        // !iterator[`documentTitle_${tempId}`] ||
        !iterator[`documentType_${tempId}`]
      )

      if (condition) {
        status = false;
        break;
      }
    }
    this.isCompletedStepFour = Boolean(this.landlordDocuments.length === 0) || status; //[TODO]
  }

  private validateApplicantDocumentForm() {
    let status = true;
    for (const iterator of this.applicantDocuments) {
      let tempId = iterator['tempId'];

      const condition = (
        !iterator[`document_${tempId}`] ||
        // !iterator[`documentTitle_${tempId}`] ||
        !iterator[`documentType_${tempId}`]
      )

      if (condition) {
        status = false;
        break;
      }
    }
    this.isCompletedStepSix = Boolean(this.applicantDocuments.length === 0) || status; //[TODO]
  }


  handleUploadLandlord(tempId, event) {
    const file = event.target.files[0];
    let base64String = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      base64String = reader.result.toString().split(",")[1];
      for (const iterator of this.landlordDocuments) {
        if (iterator.tempId === tempId) {
          iterator[`document_${tempId}`] = base64String;
          iterator[`fileName_${tempId}`] = file.name;
          break;
        }
      }
      this.validateLandlordDocumentForm();
    };
  }

  handleUploadApplicant(tempId, event) {
    const file = event.target.files[0];
    let base64String = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      base64String = reader.result.toString().split(",")[1];
      for (const iterator of this.applicantDocuments) {
        if (iterator.tempId === tempId) {
          iterator[`document_${tempId}`] = base64String;
          iterator[`fileName_${tempId}`] = file.name;
          break;
        }
      }
      this.validateApplicantDocumentForm();
    };
  }

  async addDocument(applicationId) {
    try {

      const observables = [];

      // =============== For landlord =================
      for (const iterator of this.landlordDocuments) {

        const tempId = iterator['tempId'];
        if (!iterator[`document_${tempId}`]) continue;

        const documentType = iterator[`documentType_${tempId}`];
        const documentTitle = iterator[`documentTitle_${tempId}`];
        const document = iterator[`document_${tempId}`];
        const fileName = iterator[`fileName_${tempId}`];

        const condition = (
          !iterator[`document_${tempId}`] ||
          // !iterator[`documentTitle_${tempId}`] ||
          !iterator[`documentType_${tempId}`]
        )

        if (condition) continue;

        const recordFAD = new FormActionData(0,
          this.doralData.documentsData.TableId,
          null,
          new Array<FieldListItem>()
        );

        //[TODO]
        recordFAD.fieldsList.push(new FieldListItem('document_type', 'Rental Application Landlord', ''))
        recordFAD.fieldsList.push(new FieldListItem('related_required_documents', documentType, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_title', documentTitle, ''))
        recordFAD.fieldsList.push(new FieldListItem('related_rental_assistance', applicationId, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_file', fileName, document))

        observables.push(this.ignatiusService.postData(recordFAD))
      }


      // =============== For applicant =================
      for (const iterator of this.applicantDocuments) {

        const tempId = iterator['tempId'];
        if (!iterator[`document_${tempId}`]) continue;

        const documentType = iterator[`documentType_${tempId}`];
        const documentTitle = iterator[`documentTitle_${tempId}`];
        const document = iterator[`document_${tempId}`];
        const fileName = iterator[`fileName_${tempId}`];

        const condition = (
          !iterator[`document_${tempId}`] ||
          // !iterator[`documentTitle_${tempId}`] ||
          !iterator[`documentType_${tempId}`]
        )

        if (condition) continue;

        const recordFAD = new FormActionData(0,
          this.doralData.documentsData.TableId,
          null,
          new Array<FieldListItem>()
        );

        //[TODO]
        recordFAD.fieldsList.push(new FieldListItem('document_type', 'Rental Application Applicant', ''))
        recordFAD.fieldsList.push(new FieldListItem('related_required_documents', documentType, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_title', documentTitle, ''))
        recordFAD.fieldsList.push(new FieldListItem('related_rental_assistance', applicationId, ''))
        recordFAD.fieldsList.push(new FieldListItem('document_file', fileName, document))

        observables.push(this.ignatiusService.postData(recordFAD))
      }

      await forkJoin(observables).toPromise();

    } catch (error) {
      throw error;
    }

  }

  private async deleteDocumentFromDb() {
    try {
      if (this.deletedLandlordDocuments.length === 0 && this.deletedApplicantDocuments.length === 0) {
        return;
      }
      const deletedArr = [...this.deletedLandlordDocuments, ...this.deletedApplicantDocuments]

      const observables = [];
      for (let id of deletedArr) {
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

  downloadFile(file: any) {
    this.ignatiusService.downloadFile(
      this.doralData.documentsData.TableId,
      file["id"],
      this.doralData.documentsData.RecordIdFieldId,
      file["document_file"]
    );
  }


  /*================================== Documents section End ==================================*/


  /*================================== Household section Start ==================================*/

  createHouseholdForms(data: any = {}): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(data.id || null),
      name: new FormControl(data.name || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      age: new FormControl(data.age || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      employer: new FormControl(data.employer || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      employer_phone: new FormControl(data.employer_phone || ''),//, [Validators.required, Validators.pattern(PhonePattern)])
      employer_address: new FormControl(data.employer_address || ''),//, Validators.required),
      position: new FormControl(data.position || ''),//, [Validators.required,Validators.pattern(NumberPattern)]),
      years_employed: new FormControl(data.years_employed || ''),//, Validators.required),
      supervisor: new FormControl(data.supervisor || ''),//, Validators.required)
      type: new FormControl(data.type || 'Household Member (18 and over)'),//, Validators.required)
    });
  }

  onHouseholdSizeChange(value: String) {
    if (!value || !Number(value) || Number(value) < 1) return;

    const numValue = Number(value);

    const arrLength = (<FormArray>this.thirdFormGroup.get('items')).length;

    if (arrLength < numValue) {
      for (let index = arrLength; index < numValue; index++) {
        (<FormArray>this.thirdFormGroup.get('items')).push(this.createHouseholdForms());
      }
    } else if (arrLength > numValue) {
      for (let index = arrLength - 1; index >= numValue; index--) {
        (<FormArray>this.thirdFormGroup.get('items')).removeAt(index)
      }
    } else {
      //Nothing to do :)
    }
  }

  getExistingHouseHoldData() {
    if (!this.recordId) return;
    if (this.householdEditdata.length === 0) return;

    for (const iterator of this.householdEditdata) {
      (<FormArray>this.thirdFormGroup.get('items')).push(this.createHouseholdForms(iterator));
    }
  }

  async submitHousehold(rentalId = "") {
    try {
      if (this.recordId) await this.updateHousehold();
      else await this.createHousehold(rentalId);
    } catch (error) {
      console.log('Error in [submitHousehold] => ', error);
    }
  }

  async createHousehold(rentalId: string) {

    try {
      const observables: Array<any> = [];
      const formValuesArr = this.thirdFormGroup.get('items').value;

      for (const iterator of formValuesArr) {

        const recordFAD = new FormActionData(0,
          this.doralData.householdMembersData.TableId,
          null,
          new Array<FieldListItem>()
        );

        recordFAD.fieldsList = [
          new FieldListItem("name", iterator.name, ""),
          new FieldListItem("age", iterator.age, ""),
          new FieldListItem("employer", iterator.employer, ""),
          new FieldListItem("employer_phone", iterator.employer_phone, ""),
          new FieldListItem("employer_address", iterator.employer_address, ""),
          new FieldListItem("position", iterator.position, ""),
          new FieldListItem("years_employed", iterator.years_employed, ""),
          new FieldListItem("supervisor", iterator.supervisor, ""),
          new FieldListItem("type", iterator.type, ""),
          new FieldListItem("related_rental_assistance", rentalId, ""),
        ]

        observables.push(this.ignatiusService.postData(recordFAD));
      }

      this.spinner.show();
      await forkJoin(observables).toPromise();

    } catch (error) {
      throw error;
    }



  }

  async updateHousehold() {

    try {
      const observables: Array<any> = [];
      const formValuesArr = this.thirdFormGroup.get('items').value;

      for (const iterator of formValuesArr) {

        const recordFAD = new FormActionData(0,
          this.doralData.householdMembersData.TableId,
          null,
          new Array<FieldListItem>()
        );

        recordFAD.fieldsList = [
          new FieldListItem("name", iterator.name, ""),
          new FieldListItem("age", iterator.age, ""),
          new FieldListItem("employer", iterator.employer, ""),
          new FieldListItem("employer_phone", iterator.employer_phone, ""),
          new FieldListItem("employer_address", iterator.employer_address, ""),
          new FieldListItem("position", iterator.position, ""),
          new FieldListItem("years_employed", iterator.years_employed, ""),
          new FieldListItem("supervisor", iterator.supervisor, ""),
          new FieldListItem("type", iterator.type, "")
        ];

        if (iterator.id) {
          recordFAD.where = new Where(iterator.id)
          observables.push(this.ignatiusService.putData(recordFAD));
        } else {
          recordFAD.fieldsList.push(new FieldListItem("related_rental_assistance", this.recordId, ""));
          observables.push(this.ignatiusService.postData(recordFAD));
        }
      }

      this.spinner.show();
      await forkJoin(observables).toPromise();

    } catch (error) {
      throw error;
    }

  }


  ngOnDestroy() {
    this.householdSizeSubscription.unsubscribe();
  }





  /*================================== Household section End ==================================*/

}

