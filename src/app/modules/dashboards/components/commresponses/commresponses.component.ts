import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { FormActionData, FieldListItem, Where } from 'src/app/models/form-action-data';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage.service';
import * as uuid from 'uuid';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-commresponses',
  templateUrl: './commresponses.component.html',
  styleUrls: ['./commresponses.component.css']
})
export class CommresponsesComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private ignatiusService: IgnatiusService,
    private projectSpecificService: ProjectSpecificService,
    private toastr: ToastrService,
    private storageService: StorageService
  ) { }

  responses: Object[];
  responseDocs = {};
  thread: Object;
  threadDocs: Object[];
  dfaData = this.projectSpecificService.getProjectSpecificData();
  responseData = this.dfaData.commRespData;
  threadId: any;
  responseRecord: any = {};

  documents: Array<any> = [];
  deletedDocuments: Array<any> = [];
  documentTitles = {};

  ngOnInit() {
    const componentData = this.route.snapshot.data['componentData'];
    this.threadId = this.route.snapshot.paramMap.get('id');
    this.updateThreadAndResponses(componentData);
    this.spinner.hide();
  }

  updateThreadAndResponses(componentData) {
    const [responses, thread, tDocs] = componentData;
    this.responses = responses.sort((a, b) => b.datecreated - a.datecreated);
    this.getResponseDocs();
    this.thread = thread[0];
    this.threadDocs = tDocs;
    this.updateReadStatus();
  }

  updateReadStatus() {
    const responses: any = this.responses;
    const thread: any = this.thread;

    if (thread.read == 'False') {
      this.ignatiusService.putData(
        new FormActionData(
          0,
          this.dfaData.commThreadData.TableId,
          new Where(Number(thread.id)),
          [new FieldListItem('read', 'True', '')]
        )
      ).toPromise();
    }

    responses.forEach(res => {
      if (res.read == 'False') {
        this.ignatiusService.putData(
          new FormActionData(
            0,
            this.dfaData.commRespData.TableId,
            new Where(Number(res.id)),
            [new FieldListItem('read', 'True', '')]
          )
        ).toPromise();
      }
    });
  }

  saveReply() {

    if (!this.validateDocumentForm()) {
      this.toastr.error('Document form is not valid', 'Error')
      return;
    }

    this.spinner.show();
    window.scroll(0, 0);

    let responseFA = this.getResponseFA();

    this.ignatiusService.postData(responseFA)
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
    this.toastr.error("Save Response Failed", "Error");
    this.spinner.hide();
  }

  private saveSuccess() {
    this.spinner.hide();
    this.exitPage();
    this.toastr.success("Save Response Complete", "Success");
  }

  private getResponseFA(): FormActionData {
    let updateProjectRecord =
      new FormActionData(
        0,
        this.responseData.TableId,
        null,
        new Array<FieldListItem>()
      );

    for (let [key, value] of Object.entries(this.responseRecord)) {
      if (value) {
        updateProjectRecord.fieldsList.push(new FieldListItem(key, value as string, ""));
      }
    }
    updateProjectRecord.fieldsList.push(new FieldListItem('related_comm_threads', this.threadId as string, ""));

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
          new Array<FieldListItem>());

        recordFAD.fieldsList = [
          new FieldListItem('related_applicants', applicantId, ''),
          new FieldListItem('related_applications', this.thread['related_applications'], ''),
          new FieldListItem('document_type', doc.type, ''),
          new FieldListItem('document_title', doc.title, ''),
          new FieldListItem('related_comm_responses', appId, ''),
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
    obj[`documentType_${tempId}`] = 'Comm Response Attachment';
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
        !iterator[`documentTitle_${tempId}`]
      )

      if (condition) {
        status = false;
        break;
      }
    }

    return Boolean(this.documents.length === 0) || status;
  }

  getResponseDocs() {
    let observables = new Array<Observable<Object[]>>();

    this.responses.forEach((res: { id: string }) => {
      observables.push(
        this.ignatiusService.getTargetTableObservable(
          this.dfaData.appData,
          res.id,
          this.dfaData.documentsData.TableId,
          this.dfaData.documentsData.RelatedCommResponsesFieldId as number
        )
      );
    });

    forkJoin(observables).subscribe(docs => {
      docs = docs.filter(doc => doc.length);
      docs.forEach(doc => {
        this.responseDocs[doc[0]['related_comm_responses']] = doc;
      });
      console.log(this.responseDocs);
    });
  }

  getCreatedBy(resp) {
    return resp.created_by_dfa ? 'ARCRFsupport@cteh.com' : resp.createdby;
  }

}
