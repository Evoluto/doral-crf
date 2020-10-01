export class Constants {

    public static BUSINESS_APPLICATIONS_MAPPING = {
        id: 'id',
        primary_applicant: 'primary_applicant',
        home_address: 'home_address',
        email: 'email',
        phone: 'phone',
        organization_type: 'organization_type',
        business_legal_name: 'business_legal_name',
        dba: 'dba',
        ein : 'ein',
        btr : 'btr',
        mailing_address : 'mailing_address',
        business_property_address : 'business_property_address',
        business_activity : 'business_activity',
        number_of_employees_last_year : 'number_of_employees_last_year',
        number_of_employees_current : 'number_of_employees_current',
        date_business_established : 'date_business_established',
        own_or_lease : 'own_or_lease',
        monthly_rent_mortgage : 'monthly_rent_mortgage',
        last_rent_mortgage_paid : 'last_rent_mortgage_paid',
        national_chain_or_franchise : 'national_chain_or_franchise',
        applicant1_name : 'applicant1_name',
        applicant2_name : 'applicant2_name',
        applicant3_name : 'applicant3_name',
        applicant4_name : 'applicant4_name',
        applicant1_ownership_percentage : 'applicant1_ownership_percentage',
        applicant2_ownership_percentage : 'applicant2_ownership_percentage',
        applicant3_ownership_percentage : 'applicant3_ownership_percentage',
        applicant4_ownership_percentage : 'applicant4_ownership_percentage',
        amount_requested : 'amount_requested',
        estimated_loss : 'estimated_loss',
        gross_revenue_last_year : 'gross_revenue_last_year',
        gross_revenue_this_year: 'gross_revenue_this_year',
        payroll_last_year : 'payroll_last_year',
        payroll_this_year : 'payroll_this_year',
        pre_tax_profit_last_year : 'pre_tax_profit_last_year',
        pre_tax_profit_this_year : 'pre_tax_profit_this_year',
        costs_to_recover : 'costs_to_recover',
        certifier_name: 'certifier_name',
        certifier_title: 'certifier_title',
        certify: 'certify',
        status: 'status',
        related_programs: 'related_programs',
        email_user: 'email_user'
    };

    public static BUSINESS_APPLICATIONS_MAPPING_REQUIRED: Array<string> = [
        'certify'
    ];

    public static RENTAL_APPLICATIONS_MAPPING = {
        id: 'id',
        applicant_name: 'applicant_name',
        applicant_ss_num: 'applicant_ss_num',
        co_applicant_name: 'co_applicant_name',
        co_applicant_ss_num: 'co_applicant_ss_num',
        amount_requested: 'amount_requested',
        address: 'address',
        email: 'email',
        phone: 'phone',
        household_size: 'household_size',
        name: 'name',
        employer: 'employer',
        employer_phone: 'employer_phone',
        employer_address: 'employer_address',
        position: 'position',
        years_employed: 'years_employed',
        supervisor: 'supervisor',
        landlord: 'landlord',
        landlord_authorized_representative: 'landlord_authorized_representative',
        landlord_address: 'landlord_address',
        landlord_email: 'landlord_email',
        landlord_phone: 'landlord_phone',
        certifier_name: 'certifier_name',
        certifier_title: 'certifier_title',
        certify: 'certify',
        status: 'status',
        related_programs: 'related_programs',
        email_user: 'email_user'
    };

    public static RENTAL_APPLICATIONS_MAPPING_REQUIRED: Array<string> = [
        'certify'
    ];

}

