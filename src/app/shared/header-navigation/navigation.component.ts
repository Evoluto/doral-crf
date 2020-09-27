import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})

export class NavigationComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  modalMessage = "";
  currentPassword: String;
  newPassword: String;
  confirmPassword: String;
  username = this.authService.user.getValue().userName;
  newMsg: boolean = true;
  rights: any;
  roleNameArr: any;
  showApplicants: boolean = false;
  applicant: string;
  apps: Object[] = [];
  selApplicant: string;
  userSessionData: any = {};

  ngOnInit() {
    setTimeout(() => {
      this.userSessionData = JSON.parse(localStorage.getItem('userSessionData'));
      this.newMsg = JSON.parse(localStorage.getItem('responses')) != null ? JSON.parse(localStorage.getItem('responses')).read : true;
    }, 3000);
  }

  onChange(event) {
    this.selApplicant = event;
    this.applicant = event.applicant_name;
    localStorage.setItem("relApplicant", event.id);
    //todo need to reload components with new applicant
    window.location.reload();
  }

  enableSavePassword() {
    return this.confirmPassword == this.newPassword &&
      this.confirmPassword &&
      this.newPassword &&
      this.currentPassword;
  }

  keyDownSubmitPassword(event) {
    if (event.keyCode == 13 && this.enableSavePassword()) {
      this.submitPassword();
    }
  }

  submitPassword() {
    this.authService.changePassword(this.currentPassword, this.confirmPassword)
      .subscribe(() => {
        this.toastr.success('Password Updated', 'Success');
        this.modalService.dismissAll('reason to dismiss');
      }, error => {
        this.modalMessage = error.error;
      });
  }

  openModal(content) {
    this.modalMessage = "";
    this.modalService.open(
      content,
      {
        centered: true,
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title'
      });
  }

  gotoComm() {
    this.router.navigate(['/communications']);
  }
  logout() {
    this.authService.logout();
  }

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: IgnatiusService,
    private linkService: ProjectSpecificService,
    private storageService: StorageService

  ) { }
}
