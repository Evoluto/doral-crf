import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';

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

  applicationData: any;

  ngOnInit() {
    const componentData = this.route.snapshot.data['componentData'];
    this.applicationData = (componentData && componentData[3]) ? componentData[3][0] : {};
    this.spinner.hide()
  }

}
