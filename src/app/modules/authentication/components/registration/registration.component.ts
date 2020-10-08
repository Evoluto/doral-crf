import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  user = { email: '', password: '', cpassword: '', roleId: '' };
  errMsg = '';
  termsChecked: boolean = true;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private routes: Router
  ) { }

  ngOnInit() {
    localStorage.clear();
  }

  onSubmit() {
    console.log(this.user);
    this.errMsg = '';
    if (!this.termsChecked) {
      this.errMsg = 'Please agree to all Tearms';
      return;
    }
    this.register();
  }

  async register() {
    try {
      this.spinner.show()
      await this.authService.register(this.user).toPromise();
      this.toastr.success('User created successfully', 'Success');
      this.authService.user.next(null);
      localStorage.clear();
      this.routes.navigate(['/login']);

    } catch (error) {
      this.spinner.hide()
      this.errMsg = 'Error while Registration';
    }
  }

  async isUserExists() {

  }
}
