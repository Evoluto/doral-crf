import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Resolve } from '@angular/router';
declare var $: any;
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { stringify } from 'querystring';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { StorageService } from 'src/app/services/storage.service';
import { forkJoin,Observable } from 'rxjs';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})

export class FullComponent implements OnInit {
  ngOnInit() {
    this.doralData = this.projectSpecificService.getProjectSpecificData();
    
    //// NES - NOT NOW
    //this.setApplicant();
    this.dynamicLogo = this.logoUrl;
    if (this.router.url === '/') {
      this.router.navigate(['/']);
    }
    this.defaultSidebar = this.options.sidebartype;
    this.handleSidebar();
    //this.getResponses();
  }

  public config: PerfectScrollbarConfigInterface = {};
  isSpinnerVisible: boolean = false;
  rights: any;
  roleNameArr: any;
  recordID: number = 1;
  dynamicLogo: any;
  dynamicBG: any = "#868e96";
  logoUrl = "assets/images/logo-iaf.png";
  darkLogo: SafeUrl = this.logoUrl;
  lightLogo: SafeUrl = this.logoUrl;
  lightObjUrl: string;
  darkObjUrl: string;
  projectSpecificData: any;
  doralData: any = [];
  comms: any = [];

  constructor(
    private ignatiusService: IgnatiusService,
    private projectSpecificService: ProjectSpecificService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    public sanitizer: DomSanitizer) {
  }

  tabStatus = 'justified';

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;

  options = {
    theme: 'light', // two possible values: light, dark
    dir: 'ltr', // two possible values: ltr, rtl
    layout: 'horizontal', // fixed value. shouldn't be changed.
    sidebartype: 'full', // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarpos: 'fixed', // two possible values: fixed, absolute
    headerpos: 'fixed', // two possible values: fixed, absolute
    boxed: 'full', // two possible values: full, boxed
    navbarbg: 'skin6', // six possible values: skin(1/2/3/4/5/6)
    sidebarbg: 'skin7', // six possible values: skin(1/2/3/4/5/6)
    logobg: 'skin4' // six possible values: skin(1/2/3/4/5/6)
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleSidebar();
  }

  assignLogo(blob: Blob, tmp: any): void {
    if (blob.size > 0) {
      let obj = new Blob([blob], { type: 'image/png' });
      let objectURL = URL.createObjectURL(obj);
      this.darkLogo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.lightLogo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    this.dynamicBG = "#" + tmp.background_color;
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
      case 'iconbar':
        if (this.innerWidth < 1170) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case 'overlay':
        if (this.innerWidth < 767) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case 'full':
      case 'iconbar':
        this.options.sidebartype = 'mini-sidebar';
        break;

      case 'overlay':
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          this.options.sidebartype = 'full';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  // setApplicant() {
  //   this.ignatiusService.getQueryReportObservable(
  //     this.doralData.appData,
  //     { "ApplicationTableId": this.doralData.applicantsData.TableId }
  //   ).subscribe(
  //     response => {
  //       if (response && response.length > 0) {
  //         let data: any = response[0];
  //         this.storageService.setItem('userSessionData', {
  //           applicantId: data.id,
  //           applicantName: data.applicant_name,
  //           allocationAmount: data.allocation_amount,
  //           remaining_amount: data.remaining_amount,
  //           duns_number: data.duns_number,
  //           city: data.city,
  //           state: data.state,
  //         })
  //       } else {
  //         console.log('Error ===> Applicant Data not found');
  //         localStorage.clear();
  //       }
  //     },
  //     error => {
  //       console.log('Error ===> Applicant Data not found');
  //       localStorage.clear();
  //     }
  //   )
  // }

  // private async getResponses() {
  //   const userData = this.storageService.getItem('userData');
  //   console.log(userData.userName);
  //   let observables = new Array<Observable<Object[]>>();
  //   let postBodies = new Array<any>();
  //   // NES - NOT NOW    
  //   //postBodies.push({ "ApplicationTableId": this.doralData.commRespData.TableId });
        
  //       observables = observables.concat(
  //         this.ignatiusService.getQueryReportObservables(
  //           this.doralData.appData,
  //           postBodies
  //         )
  //       );
  //   forkJoin(observables).subscribe(data => {
  //       console.log(data[0]);
  //       for(const inner of data[0]){
  //         if (inner["read"] === "False" &&
  //         inner["createdby"] != userData.userName) {
  //           this.storageService.setItem('responses', {
  //             read: false
  //           });
  //         }
  //       }
      
  //   }, error => {
     
  //   });

  // }
}
