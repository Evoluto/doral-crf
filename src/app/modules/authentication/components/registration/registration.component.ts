import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    private routes: Router
  ) {}

  ngOnInit() {
    localStorage.clear();
  }

  onSubmit() {
    console.log(this.user);
    this.errMsg = '';
    if(! this.termsChecked) {
      this.errMsg = 'Please agree to all Tearms';
      return;
    }
    this.register();
  }

  register() {
    this.authService
      .register(this.user)
      .subscribe((res) => {
        
          this.authService.user.next(null);
          localStorage.clear();
          this.routes.navigate(['/login']);
        
      }, error => {
        this.errMsg = 'Error while Registering';
      });
  }
}
