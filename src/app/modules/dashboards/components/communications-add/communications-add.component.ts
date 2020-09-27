import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { ToastrService } from 'ngx-toastr';
import { FormActionData, FieldListItem } from 'src/app/models/form-action-data';
import { StorageService } from 'src/app/services/storage.service';
import * as uuid from 'uuid';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-communications-add',
  templateUrl: './communications-add.component.html',
  styleUrls: ['./communications-add.component.css']
})
export class CommunicationsAddComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private ignatiusService: IgnatiusService,
    private projectSpecificService: ProjectSpecificService,
    private toastr: ToastrService,
    private storageService: StorageService
  ) { }

  componentData: Object[];
  dfaData = this.projectSpecificService.getProjectSpecificData();
  applications: any[] = new Array<any>();
  selApplication: string = null;
  threadData = this.dfaData.commThreadData;
  threadRecord: any = {};

  documents: Array<any> = [];
  deletedDocuments: Array<any> = [];
  documentTitles = {};

  ngOnInit() {
    this.componentData = this.route.snapshot.data['componentData'];
    let applicationsCD = this.componentData[0] as Object[];

    for (var i = 0; i < applicationsCD.length; i++) {
      this.applications.push({ ID: applicationsCD[i]["id"], Text: applicationsCD[i]["application_title"] + ' - APP-' + applicationsCD[i]["id"] });
    }

    this.spinner.hide();
  }

  saveThread() {

    if (!this.validateDocumentForm()) {
      this.toastr.error('Document form is not valid', 'Error')
      return;
    }

    this.spinner.show();
    window.scroll(0, 0);

    let threadFA = this.getThreadFA();

    this.ignatiusService.postData(threadFA)
      .subscribe((res: { recordId: string }) => {
        this.addDocument(res.recordId);
        this.saveSuccess();
      },
        () => {
          this.saveError();
        }
      )

  }

  private saveError() {
    this.toastr.error("Saving Thread Failed", "Error");
    this.spinner.hide();
  }

  private saveSuccess() {
    this.spinner.hide();
    this.exitPage();
    this.toastr.success("Save Thread Complete", "Success");
  }

  private getThreadFA(): FormActionData {
    let updateProjectRecord =
      new FormActionData(
        0,
        this.threadData.TableId,
        null,
        new Array<FieldListItem>()
      );

    for (let [key, value] of Object.entries(this.threadRecord)) {
      if (value) {
        updateProjectRecord.fieldsList.push(new FieldListItem(key, value as string, ""));
      }
    }
    updateProjectRecord.fieldsList.push(new FieldListItem('related_applications', this.selApplication as string, ""));
    updateProjectRecord.fieldsList.push(new FieldListItem('type', 'Ticket', ""));
    updateProjectRecord.fieldsList.push(new FieldListItem('status', 'Open', ""));

    return updateProjectRecord;
  }

  cancelProject() {
    this.exitPage();
  }

  exitPage() {
    this.router.navigate(['/communications'])
  }

  handleUpload(tempId, event) {
    const file = event.target.files[0];
    let base64String = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      base64String = reader.result.toString().split(",")[1];
      for (const document of this.documents) {
        if (document.tempId === tempId) {
          document[`document_${tempId}`] = base64String;
          document[`fileName_${tempId}`] = file.name;
          break;
        }
      }
    };
  }

  async addDocument(appId) {
    try {
      const observables = [];
      const applicantId = (this.storageService.getItem('userSessionData')).applicantId;

      for (const document of this.documents) {
        const tempId = document['tempId'];

        if (!document[`documentTitle_${tempId}`] || !document[`document_${tempId}`]) {
          continue;
        }

        const doc = {
          type: document[`documentType_${tempId}`],
          title: document[`documentTitle_${tempId}`],
          document: document[`document_${tempId}`],
          fileName: document[`fileName_${tempId}`]
        };

        const recordFAD = new FormActionData(0,
          this.dfaData.documentsData.TableId,
          null,
          new Array<FieldListItem>()
        );

        recordFAD.fieldsList = [
          new FieldListItem('related_applicants', applicantId, ''),
          new FieldListItem('related_applications', this.selApplication, ''),
          new FieldListItem('document_type', doc.type, ''),
          new FieldListItem('document_title', doc.title, ''),
          new FieldListItem('related_comm_threads', appId, ''),
          new FieldListItem('document', doc.fileName, doc.document)
        ];

        observables.push(this.ignatiusService.postData(recordFAD))
      }
      await forkJoin(observables).toPromise();

    } catch (error) {
      throw error;
    }
  }

  onChangeDocumentTitle(doc) {
    const tempId = doc.tempId;
    doc[`documentTitle_${tempId}`] = this.documentTitles[tempId];
  }

  addDocumentFormRow() {

    if (this.documents.length === 5) {
      this.toastr.error('Cant add more then 5 rows', 'Error');
      return
    }

    let obj = {};
    let tempId = uuid.v4();
    obj['tempId'] = tempId;
    obj[`document_${tempId}`] = '';
    obj[`fileName${tempId}`] = '';
    obj[`documentTitle_${tempId}`] = '';
    obj[`documentType_${tempId}`] = 'Comm Thread Attachment';
    this.documentTitles[tempId] = '';
    this.documents.push(obj);
  }

  removeDocumentRow(tempId) {
    const index = this.documents.findIndex(x => x.tempId === tempId);
    this.documents.splice(index, 1);
    if (this.documents.length === 0) this.documentTitles = {};
  }

  downloadFile(file: any) {
    this.ignatiusService.downloadFile(
      this.dfaData.documentsData.TableId,
      file["id"],
      this.dfaData.documentsData.DocumentFileId,
      file["document"]
    );
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
    return Boolean(this.documents.length === 0) || status;

  }

}
