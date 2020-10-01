import { AppData } from "./app-data"

export class ProjectSpecificData {
    appId: number
    appData: AppData
    programsData: ProgramsData
    businessApplicationsData: BusinessApplicationsData
    rentalApplicationsData: RentalApplicationsData
    documentsData: DocumentsData
    requiredDocumentsData: RequiredDocumentsData 
    householdMembersData: HouseholdMembersData
}

export class ProgramsData {
    TableId: number
    ProgramListReportId: number
    RecordIdFieldId: number
}

export class BusinessApplicationsData {
    TableId: number
    BusinessApplicationListReportId: number
    RecordIdFieldId: number
    RelatedProgramsFieldId:number
    OrganizationTypeMultipleChoiceID: number
    OwnOrLeaseMultipleChoiceID: number
    DateFields: string[]
}

export class RentalApplicationsData {
    TableId: number
    RentalApplicationListReportId: number
    RecordIdFieldId: number
    RelatedProgramsFieldId:number
}

export class HouseholdMembersData {
    TableId: number
    HouseholdMembersListReportId: number
    RecordIdFieldId: number
    RelatedProgramsFieldId:number
    RelatedRentalApplicationsFieldId:number
}

export class DocumentsData {
    TableId: number
    RecordIdFieldId: number
    RelatedBusinessAssistanceFieldId: number
    RelatedRentalAssistanceFieldId: number
    DocumentTypeFieldId: number
    DocumentFileId:number
    DocumentTypeId: number
}

export class RequiredDocumentsData {
    TableId: number
    RecordIdFieldId: number
    RecordFormFieldId:number
    //DocumentTypeId: number
    //RelatedBusinessAssistanceFieldId: number
    // DocumentFileId:number
    // DocumentTypeExpenditureCategoryMultipleChoiceID:number
    // DocumentTypeSelectionMultipleChoiceID:number
    // RelatedCommThreadFieldId: number
    // RelatedCommResponsesFieldId: number
    // RelatedPaymentRequestsFieldId:number
}
