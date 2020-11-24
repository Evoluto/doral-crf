import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';
import * as JSZip from 'jszip';

import { saveAs } from 'file-saver';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PackageJob } from 'src/app/models/package';
@Component({
  selector: 'app-businessapplications-view',
  templateUrl: './businessapplications-view.component.html',
  styleUrls: ['./businessapplications-view.component.css']
})
export class BusinessapplicationsViewComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private projectSpecificService: ProjectSpecificService,
    private ignatiusService: IgnatiusService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private storageService: StorageService
  ) { }


  recordId: string;
  doralData = this.projectSpecificService.getProjectSpecificData();
  applicationData: any;
  applicationDocuments: Array<any>;
  packageDocuments: Array<any>;
  packageObj: PackageJob;
  lastRun: Number;
  packageId: Number;
  queued: boolean = false;
  packageExists: Boolean = false;

  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.applicationData = (componentData && componentData[3]) ? componentData[3][0] : {};
    const applicationDocuments = (componentData && componentData[4]) ? componentData[4] : [];
    const packageData = componentData[5];
    this.applicationDocuments = this.getBusinessAppData(applicationDocuments);
    this.packageDocuments = this.getPackageDocs(applicationDocuments);
    this.getPackage(packageData);
    this.spinner.hide();
  }

  async saveZip() {

    try {
      this.toastr.info("Compressing files to zip...", "Please hold.");
      this.spinner.show();
      let zipFile: JSZip = new JSZip();
      let observables = new Array<Observable<Blob>>();
      let tableId: Number = this.doralData.documentsData.TableId;
      let fid: Number = this.doralData.documentsData.DocumentFileId;
      
      for (const iterator of this.applicationDocuments) {

        let rid = iterator.id;
        let fName = iterator.document_file;
        const url = `/api/formaction/downloadfile?tableId=${tableId}&recordId=${rid}&fieldId=${fid}&fileName=${fName}`;
        observables.push(this.ignatiusService.getFileContents({ url: url }));
      }

      const result = await forkJoin(observables).toPromise();

      if (!result && result.length === 0) throw new Error("File Not found");

      result.forEach((e, i = 0) => {
        zipFile.file(this.applicationDocuments[i].document_file, e);
      });
      zipFile.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, "Package.zip");
        this.toastr.clear();
      }, function (err) {
        this.toastr.error("That isn't working right now. Please try again later.", "Uh oh!");
        console.log(err);
      });
      this.spinner.hide();
      

    } catch (error) {
      this.toastr.error(error)
    }

  }

  getBusinessAppData(data) {
    if (data.length === 0) return []
    return data.filter(elem => elem.document_type === 'Business Application');
  }

  getPackageDocs(data) {
    if (data.length === 0) return []
    return data.filter(elem => elem.document_type === 'Package file');
  }

  getPackage(packageData: any): void {
    if (packageData) {
      this.packageObj = packageData;
      this.packageId = packageData.Id;
      this.lastRun = parseInt(packageData.LastRun) * 1000;
      this.packageExists = true;
    }
    else {
      this.lastRun = null;
      this.packageExists = false;
    }
  }


  createPackage() {
    this.spinner.show();
    let appId = environment.applicationId;

    if (this.packageExists) {
      this.packageObj.Queued = true;
      this.ignatiusService.putPackage(this.packageObj).subscribe(() => {
        this.spinner.hide();
        this.queued = true;
        this.toastr.success("It may take a few minutes to process. You can hit the refresh button to monitor the progress.", "Please wait.");
      },
        () => {
          this.toastr.error("Package update failed.", "Error");
          this.spinner.hide();
        }
      );
    } else {
      this.ignatiusService
        .postPackage(
          new PackageJob(appId, this.doralData.documentsData.DocumentFileId,
            this.doralData.documentsData.RelatedBusinessAssistanceFieldId,
            parseInt(this.recordId), true, 0, "Business Applicant Attachment"))
        .subscribe(() => {
          this.spinner.hide();
          this.queued = true;
          this.toastr.success("It may take a few minutes to process. You can hit the refresh button to monitor the progress.", "Please wait.");
        },
          () => {
            this.toastr.error("Package creation failed.", "Error");
            this.spinner.hide();
          }
        );
    }
  }


  // refreshPackages() {
  //   this.refreshed = true;

  //   this.reportService
  //     .queryReport({
  //       "ApplicationTableId": this.femaData.documentsData.TableId,
  //       "ConditionGroups": [
  //         {
  //           "Type": "all",
  //           "Conditions": [
  //             {
  //               "ConditionField": {
  //                 "Id": this.femaData.documentsData.RelatedProjectsId
  //               },
  //               "OperationType": "is equal",
  //               "Value": parseInt(this.projectID)
  //             }
  //           ]
  //         },
  //         {
  //           "Type": "all",
  //           "Conditions": [
  //             {
  //               "ConditionField": {
  //                 "Id": this.femaData.documentsData.DocumentTypeId
  //               },
  //               "OperationType": "is equal",
  //               "Value": "Package file"
  //             }
  //           ]
  //         }
  //       ]
  //     }).subscribe((response) => {
  //       this.getDocumentResults(this.femaData.appData.removeReportDataPrefix(response));
  //     });
  // }


}
