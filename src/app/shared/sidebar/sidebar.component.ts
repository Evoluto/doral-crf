import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  modalMessage = "";
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  currentPassword: String;
  newPassword: String;
  confirmPassword: String;
  username = this.authService.user.getValue().userName;

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
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

  showTab(id) {
    return true;

    // let status = false;
    // switch (id) {
    //   case 2:
    //     status = this.authService.checkAdmin();
    //     break;
    //   case 3:
    //     status = this.authService.checkAdmin();
    //     break;
    //   case 102:
    //     status = this.authService.checkAdmin();
    //     break;
    //   case 104:
    //     status = this.authService.checkAdmin();
    //     break;
    //   default:
    //     status = true;
    // }
    // return status;
  }

  logout() {
    this.authService.logout();
  }

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  }
}
