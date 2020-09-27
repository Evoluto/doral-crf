export class Constants {

    public static APPLICATIONS_MAPPING = {
        id: 'id',
        applicationTitle: 'application_title',
        applicantName: 'applicant_name',
        ceoName: 'ceo_name',
        ceoTitle: 'ceo_title',
        certifiedBy: 'certified_by',
        certifiedDt: 'certified_dt',
        certify1: 'certify_1',
        certify2: 'certify_2',
        completedOnTime: 'completed_on_time',
        completedOnTimeComments: 'completed_on_time_comments',
        hasNormalCosts: 'has_normal_costs',
        hasNormalCostsComments: 'has_normal_costs_comments',
        hasOtherFunding: 'has_other_funding',
        hasOtherFundingComments: 'has_other_funding_comments',
        isCovid: 'is_covid',
        isCovidComments: 'is_covid_comments',
        isNecessary: 'is_necessary',
        isNecessaryComments: 'is_necessary_comments',
        planAdminExpAmount: 'plan_admin_exp_amount',
        planAdminExpAmountTBC: 'plan_admin_exp_amount_tbc',
        planAdminExpDesc: 'plan_admin_exp_desc',
        planBudgetedDivertedAmount: 'plan_budgeted_diverted_amount',
        planBudgetedDivertedAmountTBC: 'plan_budgeted_diverted_amount_tbc',
        planBudgetedDivertedDesc: 'plan_budgeted_diverted_desc',
        planDistanceLearningAmount: 'plan_distance_learning_amount',
        planDistanceLearningAmountTBC: 'plan_distance_learning_amount_tbc',
        planDistanceLearningDesc: 'plan_distance_learning_desc',
        // planEconomicSupportAmount: 'plan_economic_support_amount',
        // planEconomicSupportAmountTBC: 'plan_economic_support_amount_tbc',
        // planEconomicSupportDesc: 'plan_economic_support_desc',
        planFoodAmount: 'plan_food_amount',
        planFoodAmountTBC: 'plan_food_amount_tbc',
        planFoodDesc: 'plan_food_desc',
        planHousingAmount: 'plan_housing_amount',
        planHousingAmountTBC: 'plan_housing_amount_tbc',
        planHousingDesc: 'plan_housing_desc',
        // planIssuanceOfTaxAmount: 'plan_issuance_of_tax_amount',
        // planIssuanceOfTaxAmountTBC: 'plan_issuance_of_tax_amount_tbc',
        // planIssuanceOfTaxDesc: 'plan_issuance_of_tax_desc',
        planMedicalAmount: 'plan_medical_amount',
        planMedicalAmountTBC: 'plan_medical_amount_tbc',
        planMedicalDesc: 'plan_medical_desc',
        // planNursingHomeAmount: 'plan_nursing_home_amount',
        // planNursingHomeAmountTBC: 'plan_nursing_home_amount_tbc',
        // planNursingHomeDesc: 'plan_nursing_home_desc',
        planOtherItemsAmount: 'plan_other_items_amount',
        planOtherItemsAmountTBC: 'plan_other_items_amount_tbc',
        planOtherItemsDesc: 'plan_other_items_desc',
        planPayrollAmount: 'plan_payroll_amount',
        planPayrollAmountTBC: 'plan_payroll_amount_tbc',
        planPayrollDesc: 'plan_payroll_desc',
        planPpeAmount: 'plan_ppe_amount',
        planPpeAmountTBC: 'plan_ppe_amount_tbc',
        planPpeDesc: 'plan_ppe_desc',
        planPublicHealthAmount: 'plan_public_health_amount',
        planPublicHealthAmountTBC: 'plan_public_health_amount_tbc',
        planPublicHealthDesc: 'plan_public_health_desc',
        // planSmallBusinessAmount: 'plan_small_business_amount',
        // planSmallBusinessAmountTBC: 'plan_small_business_amount_tbc',
        // planSmallBusinessDesc: 'plan_small_business_desc',
        planTeleworkAmount: 'plan_telework_amount',
        planTeleworkAmountTBC: 'plan_telework_amount_tbc',
        planTeleworkDesc: 'plan_telework_desc',
        // planTestingAmount: 'plan_testing_amount',
        // planTestingAmountTBC: 'plan_testing_amount_tbc',
        // planTestingDesc: 'plan_testing_desc',
        // planUnemploymentAmount: 'plan_unemployment_amount',
        // planUnemploymentAmountTBC: 'plan_unemployment_amount_tbc',
        // planUnemploymentDesc: 'plan_unemployment_desc',
        // planWorkersCompAmount: 'plan_workers_comp_amount',
        // planWorkersCompAmountTBC: 'plan_workers_comp_amount_tbc',
        // planWorkersCompDesc: 'plan_workers_comp_desc',
        projectDefinition: 'project_definition',
        projectDescription: 'project_description',
        relatedApplicants: 'related_applicants',
        workCompletedTotal: 'work_completed_total',
        workToBeCompletedTotal: 'work_to_be_completed_total',
        status: 'status',
        dateOfApplicantSubmission: 'date_of_applicant_submission'
    };

    public static APPLICATIONS_MAPPING_REQUIRED: Array<string> = [
        'certify1',
        'certify2'
    ];

    public static COMPLETED_WORk_KEYS: Array<string> = [
        'planAdminExpAmount',
        'planBudgetedDivertedAmount',
        //'planTestingAmount',
        //'planEconomicSupportAmount',
        //'planIssuanceOfTaxAmount',
        'planDistanceLearningAmount',
        'planFoodAmount',
        'planHousingAmount',
        'planTeleworkAmount',
        'planMedicalAmount',
        //'planNursingHomeAmount',
        'planPayrollAmount',
        'planPpeAmount',
        'planPublicHealthAmount',
        //'planSmallBusinessAmount',
        //'planUnemploymentAmount',
        //'planWorkersCompAmount',
        'planOtherItemsAmount'
    ]

    public static TO_BE_COMPLETED_WORK_KEYS: Array<string> = [
        'planAdminExpAmountTBC',
        'planBudgetedDivertedAmountTBC',
        //'planTestingAmountTBC',
        //'planEconomicSupportAmountTBC',
        //'planIssuanceOfTaxAmountTBC',
        'planDistanceLearningAmountTBC',
        'planFoodAmountTBC',
        'planHousingAmountTBC',
        'planTeleworkAmountTBC',
        'planMedicalAmountTBC',
        //'planNursingHomeAmountTBC',
        'planPayrollAmountTBC',
        'planPpeAmountTBC',
        'planPublicHealthAmountTBC',
        //'planSmallBusinessAmountTBC',
        //'planUnemploymentAmountTBC',
        //'planWorkersCompAmountTBC',
        'planOtherItemsAmountTBC'
    ]

    public static PAYMENT_MAPPING = {
        id: 'id',
        relatedProjects: 'related_projects',
        milestone: 'milestone',
        amountsIncludeGrantsOver50k: 'amounts_include_grants_over_50k',
        amountsIncludeLoansOver50k: 'amounts_include_loans_over_50k',
        amountsIncludeTransfersOver50k: 'amounts_include_transfers_over_50k',
        amountsIncludePaymentsOver50k: 'amounts_include_payments_over_50k',
        amountsIncludeContractsOver50k: 'amounts_include_contracts_over_50k',

        planAdminExpPRAmount: 'plan_admin_exp_pr_amount',
        planBudgetedDivertedPRAmount: 'plan_budgeted_diverted_pr_amount',
        planDistanceLearningPRAmount: 'plan_distance_learning_pr_amount',
        planEconomicSupportPRAmount: 'plan_economic_support_pr_amount',
        planFoodPRAmount: 'plan_food_pr_amount',
        planHousingPRAmount: 'plan_housing_pr_amount',
        planIssuanceOfTaxPRAmount: 'plan_issuance_of_tax_pr_amount',
        planMedicalPRAmount: 'plan_medical_pr_amount',
        planNursingHomePRAmount: 'plan_nursing_home_pr_amount',
        planOtherItemsPRAmount: 'plan_other_items_pr_amount',
        planPayrollPRAmount: 'plan_payroll_pr_amount',
        planPpePRAmount: 'plan_ppe_pr_amount',
        planPublicHealthPRAmount: 'plan_public_health_pr_amount',
        planSmallBusinessPRAmount: 'plan_small_business_pr_amount',
        planTeleworkPRAmount: 'plan_telework_pr_amount',
        planTestingPRAmount: 'plan_testing_pr_amount',
        planUnemploymentPRAmount: 'plan_unemployment_pr_amount',
        planWorkersCompPRAmount: 'plan_workers_comp_pr_amount',
        paymentRequestTotal: 'total_payment_request',
        relatedApplications: 'related_applications',
        milestonePercentage: 'milestone_percentage',
        // FOR TREASURY REPORTING
        contracts_identifying_info: 'identifying_info',
        contracts_item_number: 'item_number',
        contracts_item_date: 'item_date',
        contracts_misc_info: 'misc_info',
        contracts_item_amount: 'item_amount',
        contracts_item_description: 'item_description',
        contracts_primary_place_of_performance: 'primary_place_of_performance',
        contracts_period_of_performance_start_date: 'period_of_performance_start_date',
        contracts_period_of_performance_end_date: 'period_of_performance_end_date',
        contracts_quarterly_obligation_amount: 'quarterly_obligation_amount',
        contracts_quarterly_expenditure_amount: 'quarterly_expenditure_amount',
        contracts_expenditure_category: 'expenditure_category',
        grants_identifying_info: 'identifying_info',
        grants_item_number: 'item_number',
        grants_item_date: 'item_date',
        grants_misc_info: 'misc_info',
        grants_item_amount: 'item_amount',
        grants_item_description: 'item_description',
        grants_primary_place_of_performance: 'primary_place_of_performance',
        grants_period_of_performance_start_date: 'period_of_performance_start_date',
        grants_period_of_performance_end_date: 'period_of_performance_end_date',
        grants_quarterly_obligation_amount: 'quarterly_obligation_amount',
        grants_quarterly_expenditure_amount: 'quarterly_expenditure_amount',
        grants_expenditure_category: 'expenditure_category',
        loans_identifying_info: 'identifying_info',
        loans_item_number: 'item_number',
        loans_item_date: 'item_date',
        loans_misc_info: 'misc_info',
        loans_item_amount: 'item_amount',
        loans_item_description: 'item_description',
        loans_primary_place_of_performance: 'primary_place_of_performance',
        //loans_period_of_performance_start_date: 'period_of_performance_start_date',
        loans_period_of_performance_end_date: 'period_of_performance_end_date',
        loans_quarterly_obligation_amount: 'quarterly_obligation_amount',
        loans_quarterly_expenditure_amount: 'quarterly_expenditure_amount',
        loans_expenditure_category: 'expenditure_category',
        loans_recipient_plans: 'recipient_plans',
        transfers_identifying_info: 'identifying_info',
        //transfers_item_number: 'item_number',
        transfers_item_date: 'item_date',
        //transfers_misc_info: 'misc_info',
        transfers_item_amount: 'item_amount',
        transfers_item_description: 'item_description',
        // transfers_primary_place_of_performance: 'primary_place_of_performance',
        // transfers_period_of_performance_start_date: 'period_of_performance_start_date',
        // transfers_period_of_performance_end_date: 'period_of_performance_end_date',
        transfers_quarterly_obligation_amount: 'quarterly_obligation_amount',
        transfers_quarterly_expenditure_amount: 'quarterly_expenditure_amount',
        transfers_expenditure_category: 'expenditure_category',
        directPayments_identifying_info: 'identifying_info',
        //directPayments_item_number: 'item_number',
        directPayments_item_date: 'item_date',
        //directPayments_misc_info: 'misc_info',
        directPayments_item_amount: 'item_amount',
        //directPayments_item_description: 'item_description',
        // directPayments_primary_place_of_performance: 'primary_place_of_performance',
        // directPayments_period_of_performance_start_date: 'period_of_performance_start_date',
        // directPayments_period_of_performance_end_date: 'period_of_performance_end_date',
        directPayments_quarterly_obligation_amount: 'quarterly_obligation_amount',
        directPayments_quarterly_expenditure_amount: 'quarterly_expenditure_amount',
        directPayments_expenditure_category: 'expenditure_category',
        relatedPaymentRequests: 'related_payment_requests',

        type: 'type'

    };

    public static PAYMENT_REQUEST_WORK_KEYS: Array<string> = [
        'planAdminExpPRAmount',
        'planBudgetedDivertedPRAmount',
        'planTestingPRAmount',
        'planEconomicSupportPRAmount',
        'planIssuanceOfTaxPRAmount',
        'planDistanceLearningPRAmount',
        'planFoodPRAmount',
        'planHousingPRAmount',
        'planTeleworkPRAmount',
        'planMedicalPRAmount',
        'planNursingHomePRAmount',
        'planPayrollPRAmount',
        'planPpePRAmount',
        'planPublicHealthPRAmount',
        'planSmallBusinessPRAmount',
        'planUnemploymentPRAmount',
        'planWorkersCompPRAmount',
        'planOtherItemsPRAmount'
    ];

    public static SHEET_SAMPLE_DATA = [
        {
            sheetName: 'Contracts',
            sheetData: [
                {
                    'Type': "",
                    'Expenditure Category': "",
                    'Contractor Name': "",
                    'Contractor Identifying Number (DUNS, FEIN, SSN, etc.)': "",
                    'Contract Number (assigned by the agency/IHE)': "",
                    'Invoice Number': "",
                    'Date of Payment': "",
                    'Invoice Amount': "",
                    'Check Number': "",
                }
            ]
        },
        {
            sheetName: 'Grants',
            sheetData: [
                {
                    'Type': "",
                    'Expenditure Category': "",
                    'Subrecipient Name': "",
                    'Subrecipient Identifying Number (DUNS, FEIN, SSN, etc.)': "",
                    'Award Number (assigned by the agency/IHE)': "",
                    'Award Date': "",
                    'Award Amount': "",
                    'Award Description': "",
                    'Award Payment Method': "",
                }
            ]
        },
        {
            sheetName: 'Loans',
            sheetData: [
                {
                    'Type': "",
                    'Expenditure Category': "",
                    'Borrower Name': "",
                    'Borrower Identifying Number (DUNS, FEIN, SSN, etc.)': "",
                    'Loan Number (assigned by the agency/IHE)': "",
                    'Loan Date (signed by both parties)': "",
                    'Loan Amount': "",
                    'Loan Description': "",
                    'Loan Expiration Date (date paid in full)': "",
                }
            ]
        },
        {
            sheetName: 'Transfers',
            sheetData: [
                {
                    'Type': "",
                    'Expenditure Category': "",
                    'Transferee Name': "",
                    'Transferee Identifying Number (DUNS, FEIN, SSN, etc.)': "",
                    'Transfer Date': "",
                    'Transfer Amount': "",
                    'Transfer Description': "",
                }
            ]
        },
        {
            sheetName: 'Direct Payments',
            sheetData: [
                {
                    'Type': "",
                    'Expenditure Category': "",
                    'Payee Name': "",
                    'Payee Identifying Number (DUNS, FEIN, SSN, etc.)': "",
                    'Direct Payment Date': "",
                    'Direct Payment Amount': ""
                }
            ]
        }
    ]

}

