import { AppData } from "./app-data"

export class ProjectSpecificData {
    appId: number
    appData: AppData
    applicationsData: ApplicationsData
    applicantsData: ApplicantsData
    projectsData: ProjectsData
    commThreadData: CommThreadData
    commRespData: CommRespData
    paymentRequestData: PaymentRequestData
    documentsData: DocumentsData
    treasuryReportingData: TreasuryReportingData
}

export class ApplicationsData {
    TableId: number
    ApplicationListReportId: number
    RecordIdFieldId: number
}

export class ApplicantsData {
    TableId: number
}

export class ProjectsData {
    TableId: number
    RecordIdFieldId:number
    RelatedApplicationsId: number
}

export class CommThreadData {
    TableId: number
    RecordIdFieldId: number
}

export class CommRespData {
    TableId: number
    RecordIdFieldId: number
    RelatedThreadId: number
    ResponseFieldId: number
}

export class PaymentRequestData {
    TableId: number
    RecordIdFieldId: number
    MilestoneMultipleChoiceID:number
    RelatedProjectsId:number
}

export class DocumentsData {
    TableId: number
    RecordIdFieldId: number
    RelatedApplicationsFieldId: number
    DocumentFileId:number
    DocumentTypeExpenditureCategoryMultipleChoiceID:number
    DocumentTypeSelectionMultipleChoiceID:number
    DocumentTypeId: number
    RelatedCommThreadFieldId: number
    RelatedCommResponsesFieldId: number
    RelatedPaymentRequestsFieldId:number
}

export class TreasuryReportingData {
    TableId: number
    RecordIdFieldId: number
    RelatedPaymentRequestsFieldId: number
    TypeMultipleChoiceID:number
    ExpenditureCategoryMultipleChoiceID:number
}

