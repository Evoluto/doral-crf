import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { PasswordRecoveryData } from 'src/app/models/password-recovery-data';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loginFormState', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0,
      })),
      state('remove', style({
        opacity: 0,
        height: 0
      })),
      state('add', style({
        opacity: 0
      })),
      transition('show => hide', [
        animate('0.3s ease-out')
      ]),
      transition('hide => remove', [
        animate('0.3s ease-out')
      ]),
      transition('remove => add', [
        animate('0.5s ease-in')
      ]),
      transition('add => show', [
        animate('0.4s ease-in')
      ]),
    ])
  ]
})
export class LoginComponent implements OnInit {
  msg = '';
  isLoading = false;
  loginForm = true;
  loginFormState = 'show';
  submitText = 'Log In'
  forgotText = 'Forgot Password?'
  error = false;
  changePassword = false;
  forgotPassword = false;

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private routes: Router,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.router.url.includes("passwordrecovery")) {
      this.changePassword = true;
    }
    this.spinner.hide();
  }

  transformLogin() {
    this.loginFormState = this.loginForm ? 'hide' : 'add';
    this.loginForm = !this.loginForm;
    this.error = false;
    this.msg = this.loginForm ? '' : 'Submit email for password recovery';
    this.submitText = this.loginForm ? 'Log In' : 'Submit';
    this.forgotText = this.loginForm ? 'Forgot Password?' : 'Return to Log In';
  }

  getChangePasswordStyle(type): Object {
    let invisible = { 'display': 'none' };
    return this.changePassword && type === 'login' ||
      !this.changePassword && type === 'recovery' ||
      this.forgotPassword ? invisible : {};
  }

  submit(username: string, password: string) {
    if (this.loginForm) {
      this.isLoading = true;
      this.authService
        .signIn(username, password)
        .subscribe((user) => {

          if (user) {
            this.routes.navigate(['/']);
          } else {
            this.handSubmitError();
          }
        }, error => {
          this.handSubmitError();
        });
    } else {
      this.isLoading = true;
      this.authService.forgotPassword(username).subscribe(() => {
        this.error = false
        this.msg = 'An email has been sent with recovery instructions. If you do not receive an email within 5 minutes, please check your spam folder.'
        this.isLoading = false;
      }, error => {
        this.error = true;
        this.msg = 'Unable to send recovery instructions';
        this.isLoading = false;
      });
    }
  }

  private handSubmitError() {
    this.error = true;
    this.msg = 'Invalid Username or Password';
    this.isLoading = false;
  }

  recoverPassword(username: string, recoveryCode: string, newPassword: string, confirmPassword: string) {
    if (newPassword === confirmPassword) {
      this.isLoading = true;
      this.authService.recoverPassword(
        new PasswordRecoveryData(
          username,
          environment.deploymentUrl,
          confirmPassword,
          recoveryCode
        )
      ).subscribe(() => {
        this.toastr.success('Password Updated', 'Success');
        this.changePassword = false;
        this.loginForm = true;
        this.isLoading = false;
        this.msg = '';
      }, error => {
        this.error = true
        this.msg = 'Unable to update password';
        this.isLoading = false;
      });
    } else {
      this.error = true;
      this.msg = 'Password fields do not match';
    }
  }

  animationDone(event: AnimationEvent) {
    if (event['fromState'] === 'show') {
      this.loginFormState = 'remove';
    }
    else if (event['fromState'] === 'hide') {
      this.forgotPassword = true;
    }
    else if (event['fromState'] === 'remove') {
      this.loginFormState = 'show';
    }
  }

  animationStart(event: AnimationEvent) {
    if (event['fromState'] === 'remove') {
      this.forgotPassword = false;
    }
  }

}
