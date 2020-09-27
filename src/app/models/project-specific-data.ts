import { AppData } from "./app-data"

export class ProjectSpecificData {
    appId: number
    appData: AppData
    programsData: ProgramsData
    businessApplicationsData: BusinessApplicationsData
    rentalApplicationsData: RentalApplicationsData
    documentsData: DocumentsData
    requredDocumentsData: RequiredDocumentsData
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
    RelatedBusinessApplicationsFieldId: number
    // DocumentFileId:number
    // DocumentTypeExpenditureCategoryMultipleChoiceID:number
    // DocumentTypeSelectionMultipleChoiceID:number
    // DocumentTypeId: number
    // RelatedCommThreadFieldId: number
    // RelatedCommResponsesFieldId: number
    // RelatedPaymentRequestsFieldId:number
}
export class RequiredDocumentsData {
    TableId: number
    RecordIdFieldId: number
    //RelatedBusinessApplicationsFieldId: number
    // DocumentFileId:number
    // DocumentTypeExpenditureCategoryMultipleChoiceID:number
    // DocumentTypeSelectionMultipleChoiceID:number
    // DocumentTypeId: number
    // RelatedCommThreadFieldId: number
    // RelatedCommResponsesFieldId: number
    // RelatedPaymentRequestsFieldId:number
}

export class TreasuryReportingData {
    TableId: number
    RecordIdFieldId: number
    RelatedPaymentRequestsFieldId: number
    TypeMultipleChoiceID:number
    ExpenditureCategoryMultipleChoiceID:number
}

