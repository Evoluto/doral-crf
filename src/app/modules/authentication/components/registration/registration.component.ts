import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  user = { email: '', password: '', cpassword: '' };
  errMsg = '';
  termsChecked: boolean = true;

  constructor(
    private authService: AuthService,
    private routes: Router
  ) {}

  ngOnInit() {
    localStorage.clear();
  }

  onSubmit() {
    this.errMsg = '';
    if(! this.termsChecked) {
      this.errMsg = 'Please agree to all Tearms';
      return;
    }
    this.login();
  }

  register() {
    this.authService
      .register(this.user)
      .subscribe((res) => {
        if (res) {
          localStorage.clear();
          this.routes.navigate(['/login']);
        } else {
          this.errMsg = 'Error while Registration';
        }
      }, error => {
        this.errMsg = 'Error while Registration';
      });
  }

  login() {
    // const username = 'register_user@mail.com';
    // const password = 'rU$loraD1001!';
    const username = 'super_gaurav@mail.com';
    const password = 'Summer@1234';
    this.authService
      .signIn(username, password)
      .subscribe((user) => {
        if (user) {
          this.register();
        } else {
          this.errMsg = 'Internal Server Error';
        }
      }, error => {
        this.errMsg = 'Internal Server Error';
      });
  }


}
