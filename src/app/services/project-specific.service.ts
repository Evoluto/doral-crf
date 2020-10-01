import { Injectable } from '@angular/core';
import { AppData, AppItem } from '../models/app-data';
import {
	ProjectSpecificData as ProjectSpecificData,
	ProgramsData,
	BusinessApplicationsData,
	RentalApplicationsData,
	DocumentsData,
	RequiredDocumentsData,
	HouseholdMembersData
} from '../models/project-specific-data';

@Injectable()
export class ProjectSpecificService {
	constructor() { }

	getProjectSpecificData(): ProjectSpecificData {
		let projectSpecificData = JSON.parse(localStorage.getItem('doralData'));
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

		/* ===================== [1] Table = 'Programs' =================*/
		let programsData = appData.Tables.find(t => t.Name === 'Programs');
		projectSpecificData.programsData = new ProgramsData();
		projectSpecificData.programsData.TableId = programsData.Id;
		projectSpecificData.programsData.ProgramListReportId = appData.getAppItemId(programsData.Reports, 'List All');
		projectSpecificData.programsData.RecordIdFieldId = appData.getAppItemId(programsData.Fields, 'Record Id');

		/* ===================== [2] Table = 'Business Applications' ====================*/
		let businessApplicationsData = appData.Tables.find(t => t.Name === 'Business Applications');
		projectSpecificData.businessApplicationsData = new BusinessApplicationsData();
		projectSpecificData.businessApplicationsData.TableId = businessApplicationsData.Id;
		projectSpecificData.businessApplicationsData.BusinessApplicationListReportId = appData.getAppItemId(businessApplicationsData.Reports, 'List All');
		projectSpecificData.businessApplicationsData.RecordIdFieldId = appData.getAppItemId(businessApplicationsData.Fields, 'Record Id');
		projectSpecificData.businessApplicationsData.RelatedProgramsFieldId = appData.getAppItemId(businessApplicationsData.Fields, 'Related Programs');
		projectSpecificData.businessApplicationsData.OrganizationTypeMultipleChoiceID = appData.getAppItemId(businessApplicationsData.Fields, 'Organization Type');
		projectSpecificData.businessApplicationsData.OwnOrLeaseMultipleChoiceID = appData.getAppItemId(businessApplicationsData.Fields, 'Own or Lease');
		projectSpecificData.businessApplicationsData.DateFields = ["date_business_established", "last_rent_mortgage_paid"];

		/* ===================== [3] Table = 'Rental Applications' ======================*/
		let rentalApplicationsData = appData.Tables.find(t => t.Name === 'Rental Applications');
		projectSpecificData.rentalApplicationsData = new RentalApplicationsData();
		projectSpecificData.rentalApplicationsData.TableId = rentalApplicationsData.Id;
		projectSpecificData.rentalApplicationsData.RentalApplicationListReportId = appData.getAppItemId(rentalApplicationsData.Reports, 'List All');
		projectSpecificData.rentalApplicationsData.RecordIdFieldId = appData.getAppItemId(rentalApplicationsData.Fields, 'Record Id');
		projectSpecificData.rentalApplicationsData.RelatedProgramsFieldId = appData.getAppItemId(rentalApplicationsData.Fields, 'Related Programs');

		/* ===================== [4] Table = 'Household Members' ======================*/
		let householdMembersData = appData.Tables.find(t => t.Name === 'Household Members');
		projectSpecificData.householdMembersData = new HouseholdMembersData();
		projectSpecificData.householdMembersData.TableId = householdMembersData.Id;
		projectSpecificData.householdMembersData.RecordIdFieldId = appData.getAppItemId(householdMembersData.Fields, 'Record Id');
		projectSpecificData.householdMembersData.RelatedRentalAssistanceFieldId = appData.getAppItemId(householdMembersData.Fields, 'Related Rental Assistance');
		
		projectSpecificData.householdMembersData.RelatedProgramsFieldId = appData.getAppItemId(householdMembersData.Fields, 'Related Programs');
		projectSpecificData.householdMembersData.RelatedRentalApplicationsFieldId = appData.getAppItemId(householdMembersData.Fields, 'Related Rental Applications');

		/* ===================== [5] Table = 'Documents' ================*/
		let documentsData = appData.Tables.find(t => t.Name === 'Documents');
		projectSpecificData.documentsData = new DocumentsData();
		projectSpecificData.documentsData.TableId = documentsData.Id;
		projectSpecificData.documentsData.RecordIdFieldId = appData.getAppItemId(documentsData.Fields, 'Record Id');
		projectSpecificData.documentsData.DocumentTypeFieldId = appData.getAppItemId(documentsData.Fields, 'Document Type');
		projectSpecificData.documentsData.RelatedBusinessAssistanceFieldId = appData.getAppItemId(documentsData.Fields, 'Related Business Assistance');
		projectSpecificData.documentsData.RelatedRentalAssistanceFieldId = appData.getAppItemId(documentsData.Fields, 'Related Rental Assistance');
		projectSpecificData.documentsData.DocumentFileId = appData.getAppItemId(documentsData.Fields, 'Document');
		projectSpecificData.documentsData.DocumentTypeId = appData.getAppItemId(documentsData.Fields, "Document Type");

		/* ===================== [6] Table = 'Required Documents' ======================*/
		let requiredDocumentsData = appData.Tables.find(t => t.Name === 'Required Documents');
		projectSpecificData.requiredDocumentsData = new RequiredDocumentsData();
		projectSpecificData.requiredDocumentsData.TableId = requiredDocumentsData.Id;
		projectSpecificData.requiredDocumentsData.RecordIdFieldId = appData.getAppItemId(requiredDocumentsData.Fields, 'Record Id');
		projectSpecificData.requiredDocumentsData.RecordFormFieldId = appData.getAppItemId(requiredDocumentsData.Fields, 'Required From');

		
		projectSpecificData.appData = JSON.parse(JSON.stringify(appData));
		projectSpecificData.appData.Tables.forEach(t => t.Fields = null);


		/**
		 * Saving in local storage 
		 */
		localStorage.setItem('doralData', JSON.stringify(projectSpecificData));
	}
}