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

  doralData = this.projectSpecificService.getProjectSpecificData();
  applicationData: any;
  applicationDocuments: Array<any>;

  ngOnInit() {
    const componentData = this.route.snapshot.data['componentData'];
    this.applicationData = (componentData && componentData[3]) ? componentData[3][0] : {};
    this.applicationDocuments = (componentData && componentData[4]) ? componentData[4] : [];
    this.spinner.hide()
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

}
