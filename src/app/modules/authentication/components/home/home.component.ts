import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { PasswordRecoveryData } from 'src/app/models/password-recovery-data';
import { environment } from 'src/environments/environment';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent implements OnInit {
  msg = '';
  isLoading = false;
  
  isBusiness: boolean = true;
  isRental: boolean = false;
  isEnglish: boolean = true;
  isSpanish: boolean = false;

  constructor(
    private authService: AuthService,
    private routes: Router,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {

  }

  onApplicationTypeChange(type) {
    if (type == "Business") {
      this.isBusiness = true;
      this.isRental = false;
    }
    else {
      this.isRental = true;
      this.isBusiness = false;
    }
  }

  onLanguageChange(type) {
    if (type == "English") {
      this.isEnglish = true;
      this.isSpanish = false;
    }
    else {
      this.isSpanish = true;
      this.isEnglish = false;
    }
  }
}