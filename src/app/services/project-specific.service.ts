import { Injectable } from '@angular/core';
import { AppData, AppItem } from '../models/app-data';
import {
	ProjectSpecificData as ProjectSpecificData,
	ApplicationsData,
	ApplicantsData,
	ProjectsData,
	CommThreadData,
	CommRespData,
	PaymentRequestData,
	DocumentsData,
	TreasuryReportingData
} from '../models/project-specific-data';

@Injectable()
export class ProjectSpecificService {
	constructor() { }

	getProjectSpecificData(): ProjectSpecificData {
		let projectSpecificData = JSON.parse(localStorage.getItem('dfaData'));
		projectSpecificData.appData = this.parseAppData(projectSpecificData.appData);
		return projectSpecificData;
	}

	getPermissions(tableName: string): boolean {
		const permissionData = JSON.parse(localStorage.getItem('permissionData'))
		if (!permissionData || !permissionData.length) return false;
		const tablePermission = permissionData.find(elem => elem.Name === tableName);
		if (!tablePermission || !tablePermission.Create) return false;
		return Boolean(tablePermission.Create);
	}

	getApplicationData() {
		const applicationData = JSON.parse(localStorage.getItem('applicationData'))
		if (!applicationData) return {};
		return applicationData;

	}

	private parseAppData(appData: AppData) {
		return new AppData(appData.Name, appData.DbName, appData.Tables, appData.Users);
	}

	createProjectSpecificData(appData: AppData) {
		let projectSpecificData = new ProjectSpecificData();

		appData = this.parseAppData(appData);

		/* ===================== [1] Table = 'Applications' =================*/
		let applicationsData = appData.Tables.find(t => t.Name === 'Applications');
		projectSpecificData.applicationsData = new ApplicationsData();
		projectSpecificData.applicationsData.TableId = applicationsData.Id;
		projectSpecificData.applicationsData.ApplicationListReportId = appData.getAppItemId(applicationsData.Reports, 'List All');
		projectSpecificData.applicationsData.RecordIdFieldId = appData.getAppItemId(applicationsData.Fields, 'Record Id');

		/* ===================== [2] Table = 'Applicants' ====================*/
		let applicantsData = appData.Tables.find(t => t.Name === 'Applicants');
		projectSpecificData.applicantsData = new ApplicantsData();
		projectSpecificData.applicantsData.TableId = applicantsData.Id;

		/* ===================== [3] Table = 'Projects' ======================*/
		let projectsData = appData.Tables.find(t => t.Name === 'Projects');
		projectSpecificData.projectsData = new ProjectsData();
		projectSpecificData.projectsData.TableId = projectsData.Id;
		projectSpecificData.projectsData.RecordIdFieldId = appData.getAppItemId(projectsData.Fields, 'Record Id');
		projectSpecificData.projectsData.RelatedApplicationsId = appData.getAppItemId(projectsData.Fields, 'Related Applications');

		/* ===================== [4] Table = 'Comm Threads' ==================*/
		let commThreadData = appData.Tables.find(t => t.Name === 'Comm Threads');
		projectSpecificData.commThreadData = new CommThreadData();
		projectSpecificData.commThreadData.TableId = commThreadData.Id;
		projectSpecificData.commThreadData.RecordIdFieldId = appData.getAppItemId(commThreadData.Fields, 'Record Id');

		/* ===================== [5] Table = 'Comm Responses' ================*/
		let commRespData = appData.Tables.find(t => t.Name === 'Comm Responses');
		projectSpecificData.commRespData = new CommRespData();
		projectSpecificData.commRespData.TableId = commRespData.Id;
		projectSpecificData.commRespData.RecordIdFieldId = appData.getAppItemId(commRespData.Fields, 'Record Id');
		projectSpecificData.commRespData.RelatedThreadId = appData.getAppItemId(commRespData.Fields, 'Related Comm Threads');
		projectSpecificData.commRespData.ResponseFieldId = appData.getAppItemId(commRespData.Fields, 'Response');


		/* ===================== [6] Table = 'Payment Requests' ================*/
		let paymentRequestData = appData.Tables.find(t => t.Name === 'Payment Requests');
		projectSpecificData.paymentRequestData = new PaymentRequestData();
		projectSpecificData.paymentRequestData.TableId = paymentRequestData.Id;
		projectSpecificData.paymentRequestData.RecordIdFieldId = appData.getAppItemId(paymentRequestData.Fields, 'Record Id');
		projectSpecificData.paymentRequestData.MilestoneMultipleChoiceID = appData.getAppItemId(paymentRequestData.Fields, 'Milestone');
		projectSpecificData.paymentRequestData.RelatedProjectsId = appData.getAppItemId(paymentRequestData.Fields, 'Related Projects');


		/* ===================== [7] Table = 'Documents' ================*/
		let documentsData = appData.Tables.find(t => t.Name === 'Documents');
		projectSpecificData.documentsData = new DocumentsData();
		projectSpecificData.documentsData.TableId = documentsData.Id;
		projectSpecificData.documentsData.RecordIdFieldId = appData.getAppItemId(documentsData.Fields, 'Record Id');
		projectSpecificData.documentsData.DocumentFileId = appData.getAppItemId(documentsData.Fields, 'Document');
		projectSpecificData.documentsData.DocumentTypeExpenditureCategoryMultipleChoiceID = appData.getAppItemId(documentsData.Fields, 'Document Type Expenditure Category');
		projectSpecificData.documentsData.DocumentTypeSelectionMultipleChoiceID = appData.getAppItemId(documentsData.Fields, 'Document Type Selection');
		projectSpecificData.documentsData.DocumentTypeId = appData.getAppItemId(documentsData.Fields, "Document Type");
		projectSpecificData.documentsData.RelatedCommThreadFieldId = appData.getAppItemId(documentsData.Fields, 'Related Comm Threads');
		projectSpecificData.documentsData.RelatedApplicationsFieldId = appData.getAppItemId(documentsData.Fields, 'Related Applications');
		projectSpecificData.documentsData.RelatedCommResponsesFieldId = appData.getAppItemId(documentsData.Fields, 'Related Comm Responses');
		projectSpecificData.documentsData.RelatedPaymentRequestsFieldId = appData.getAppItemId(documentsData.Fields, 'Related Payment Requests');

		
		
		/* ===================== [8] Table = 'Expenditures' ================*/
		let treasuryReportingData = appData.Tables.find(t => t.Name === 'Expenditures');
		projectSpecificData.treasuryReportingData = new TreasuryReportingData();
		projectSpecificData.treasuryReportingData.TableId = treasuryReportingData.Id;
		projectSpecificData.treasuryReportingData.RecordIdFieldId = appData.getAppItemId(treasuryReportingData.Fields, 'Record Id');
		projectSpecificData.treasuryReportingData.RelatedPaymentRequestsFieldId = appData.getAppItemId(treasuryReportingData.Fields, 'Related Payment Requests');
		projectSpecificData.treasuryReportingData.TypeMultipleChoiceID = appData.getAppItemId(treasuryReportingData.Fields, 'Type');
		projectSpecificData.treasuryReportingData.ExpenditureCategoryMultipleChoiceID = appData.getAppItemId(treasuryReportingData.Fields, 'Expenditure Category');

		projectSpecificData.appData = JSON.parse(JSON.stringify(appData));
		projectSpecificData.appData.Tables.forEach(t => t.Fields = null);


		/**
		 * Saving in local storage 
		 */
		localStorage.setItem('dfaData', JSON.stringify(projectSpecificData));
	}
}