import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IgnatiusService } from 'src/app/services/ignatius.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectSpecificService } from 'src/app/services/project-specific.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-projects-view',
  templateUrl: './projects-view.component.html',
  styleUrls: ['./projects-view.component.css']
})
export class ProjectsViewComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private ignatiusService: IgnatiusService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private projectSpecificService: ProjectSpecificService,
    private authService: AuthService,
    private location: Location
  ) { }

  disableInput: boolean = true;
  componentDataObtained = false;
  componentData: Object[];
  projectsData: any;
  paymentRequests: Array<any>;
  applicationData: any = {};
  rows: any = []

  record: any = {};
  recordId: any = {};

  projects: any[] = new Array<any>();
  projectId: any = null;

  dfaData = this.projectSpecificService.getProjectSpecificData();
  userSessionData: any = {};

  // Charts properties
  chartsGradient: boolean = true;
  chartsView: any[] = [1000, 250];
  chartsColorScheme = {
    domain: ['#4fc3f7', '#fb8c00', '#7460ee', '#f62d51', '#20c997', '#2962FF']
  };
  chartData: any[];


  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('id');
    const componentData = this.route.snapshot.data['componentData'];
    this.projectsData = (componentData && componentData[0]) ? componentData[0][0] : {};
    this.paymentRequests = componentData[1];
    this.userSessionData = this.storageService.getItem('userSessionData');
    this.getApplicationData(this.projectsData)
    this.spinner.hide();
  }

  exitPage() {
    this.location.back();
  }

  downloadFile(id) {
    this.spinner.show();
    this.ignatiusService
      .getQueryReportObservable(
        this.dfaData.appData,
        {
          "ApplicationTableId": this.dfaData.documentsData.TableId,
          "ConditionGroups": [
            {
              "Type": "all",
              "Conditions": [
                {
                  "ConditionField": {
                    "Id": this.dfaData.documentsData.RelatedApplicationsFieldId
                  },
                  "OperationType": "is equal",
                  "Value": Number(id)
                },
                {
                  "ConditionField": {
                    "Id": this.dfaData.documentsData.DocumentTypeId
                  },
                  "OperationType": "is equal",
                  "Value": "Package file"
                },
                {
                  "ConditionField": {
                    "Id": this.dfaData.documentsData.DocumentFileId
                  },
                  "OperationType": "start with",
                  "Value": "CTCApplication"
                }
              ]
            }
          ]
        })
      .subscribe((response) => {
        if (response.length === 0) {
          this.toastr.warning("PDF is creating.. please wait a few minutes and try again.");
          this.spinner.hide();
          return;
        }
        let pdfJob = response.sort((a, b) => b["datecreated"] - a["datecreated"]);
        console.log(pdfJob);
        this.ignatiusService.downloadFile(
          this.dfaData.documentsData.TableId,
          pdfJob[0]["id"],
          this.dfaData.documentsData.DocumentFileId,
          pdfJob[0]["document"]
        );
        this.spinner.hide();
      });
  }

  async getApplicationData(projectsData) {
    try {
      if (!this.recordId) return;

      this.spinner.show();
      let applicationData = await this.ignatiusService.getTargetTableObservable(
        this.dfaData.appData,
        String(projectsData.related_applications),
        this.dfaData.applicationsData.TableId as number,
        this.dfaData.applicationsData.RecordIdFieldId as number
      ).toPromise();

      this.applicationData = (applicationData.length > 0) ? applicationData[0] : {};
      this.setupChartData(this.applicationData);

      this.spinner.hide();
    } catch (error) {
      this.spinner.hide()
      this.toastr.error('Error in fetching applicationdata', "Error")
    }
  }

  setupChartData(applicationData) {

    const chartData = [];

    if (applicationData.plan_admin_exp_amount_total && applicationData.plan_admin_exp_amount_total !== '0') {
      chartData.push({
        "name": "Admin Expenses",
        "value": Number(applicationData.plan_admin_exp_amount_total)
      })
    }

    if (applicationData.plan_budgeted_diverted_amount_total && applicationData.plan_budgeted_diverted_amount_total !== '0') {
      chartData.push({
        "name": "Budgeted diverted",
        "value": Number(applicationData.plan_budgeted_diverted_amount_total)
      })
    }

    if (applicationData.plan_distance_learning_amount_total && applicationData.plan_distance_learning_amount_total !== '0') {
      chartData.push({
        "name": "Distance learning",
        "value": Number(applicationData.plan_distance_learning_amount_total)
      })
    }

    // if (applicationData.plan_economic_support_amount_total && applicationData.plan_economic_support_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Economic support",
    //     "value": Number(applicationData.plan_economic_support_amount_total)
    //   })
    // }

    if (applicationData.plan_food_amount_total && applicationData.plan_food_amount_total !== '0') {
      chartData.push({
        "name": "Food Expenses",
        "value": Number(applicationData.plan_food_amount_total)
      })
    }

    if (applicationData.plan_housing_amount_total && applicationData.plan_housing_amount_total !== '0') {
      chartData.push({
        "name": "Housing Expenses",
        "value": Number(applicationData.plan_housing_amount_total)
      })
    }

    // if (applicationData.plan_issuance_of_tax_amount_total && applicationData.plan_issuance_of_tax_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Tax Issuance",
    //     "value": Number(applicationData.plan_issuance_of_tax_amount_total)
    //   })
    // }

    if (applicationData.plan_medical_amount_total && applicationData.plan_medical_amount_total !== '0') {
      chartData.push({
        "name": "Medical Expenses",
        "value": Number(applicationData.plan_medical_amount_total)
      })
    }

    // if (applicationData.plan_nursing_home_amount_total && applicationData.plan_nursing_home_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Nursing home",
    //     "value": Number(applicationData.plan_nursing_home_amount_total)
    //   })
    // }

    if (applicationData.plan_other_items_amount_total && applicationData.plan_other_items_amount_total !== '0') {
      chartData.push({
        "name": "Other Expenses",
        "value": Number(applicationData.plan_other_items_amount_total)
      })
    }

    if (applicationData.plan_payroll_amount_total && applicationData.plan_payroll_amount_total !== '0') {
      chartData.push({
        "name": "Payroll",
        "value": Number(applicationData.plan_payroll_amount_total)
      })
    }

    if (applicationData.plan_ppe_amount_total && applicationData.plan_ppe_amount_total !== '0') {
      chartData.push({
        "name": "ppe Expenses",
        "value": Number(applicationData.plan_ppe_amount_total)
      })
    }

    if (applicationData.plan_public_health_amount_total && applicationData.plan_public_health_amount_total !== '0') {
      chartData.push({
        "name": "Public health",
        "value": Number(applicationData.plan_public_health_amount_total)
      })
    }

    // if (applicationData.plan_small_business_amount_total && applicationData.plan_small_business_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Business Expenses",
    //     "value": Number(applicationData.plan_small_business_amount_total)
    //   })
    // }

    if (applicationData.plan_telework_amount_total && applicationData.plan_telework_amount_total !== '0') {
      chartData.push({
        "name": "Telework Expenses",
        "value": Number(applicationData.plan_telework_amount_total)
      })
    }

    // if (applicationData.plan_testing_amount_total && applicationData.plan_testing_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Testing Expenses",
    //     "value": Number(applicationData.plan_testing_amount_total)
    //   })
    // }

    // if (applicationData.plan_unemployment_amount_total && applicationData.plan_unemployment_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Unemployment Expenses",
    //     "value": Number(applicationData.plan_unemployment_amount_total)
    //   })
    // }

    // if (applicationData.plan_workers_comp_amount_total && applicationData.plan_workers_comp_amount_total !== '0') {
    //   chartData.push({
    //     "name": "Workers Expenses",
    //     "value": Number(applicationData.plan_workers_comp_amount_total)
    //   })
    // }

    this.chartData = chartData;
  }

  createPaymentRequest(projectId) {
    this.router.navigate(['/payments/add'], { queryParams: { project: projectId } });
  }
}
