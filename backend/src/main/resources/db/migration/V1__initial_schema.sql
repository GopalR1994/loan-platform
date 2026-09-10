CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    date_of_birth DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_kyc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL UNIQUE,
    kyc_type VARCHAR(50) NOT NULL,
    id_number VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer_kyc_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    account_holder_name VARCHAR(200),
    bank_name VARCHAR(200),
    account_number VARCHAR(100),
    branch_code VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bank_account_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    requested_amount NUMERIC(19,4) NOT NULL,
    requested_tenure_months INTEGER NOT NULL,
    purpose VARCHAR(255),
    status VARCHAR(40) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_application_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

CREATE TABLE loan_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_application_id UUID NOT NULL,
    approved_amount NUMERIC(19,4) NOT NULL,
    interest_rate NUMERIC(10,4) NOT NULL,
    tenure_months INTEGER NOT NULL,
    processing_fee NUMERIC(19,4) NOT NULL DEFAULT 0,
    total_payable NUMERIC(19,4),
    emi_amount NUMERIC(19,4),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_offer_application
        FOREIGN KEY (loan_application_id)
        REFERENCES loan_applications(id)
);

CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_number VARCHAR(50) NOT NULL UNIQUE,
    loan_application_id UUID NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    principal_amount NUMERIC(19,4) NOT NULL,
    outstanding_principal NUMERIC(19,4) NOT NULL,
    interest_rate NUMERIC(10,4) NOT NULL,
    tenure_months INTEGER NOT NULL,
    emi_amount NUMERIC(19,4) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'APPROVED',
    disbursed_at TIMESTAMP WITH TIME ZONE,
    maturity_date DATE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_application
        FOREIGN KEY (loan_application_id)
        REFERENCES loan_applications(id),

    CONSTRAINT fk_loan_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

CREATE TABLE loan_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    principal_amount NUMERIC(19,4) NOT NULL,
    interest_amount NUMERIC(19,4) NOT NULL,
    total_due NUMERIC(19,4) NOT NULL,
    principal_paid NUMERIC(19,4) NOT NULL DEFAULT 0,
    interest_paid NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_schedule_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(id),

    CONSTRAINT uq_loan_installment
        UNIQUE (loan_id, installment_number)
);

CREATE TABLE disbursements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL,
    reference_number VARCHAR(100) NOT NULL UNIQUE,
    amount NUMERIC(19,4) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    provider VARCHAR(100),
    provider_reference VARCHAR(200),
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_disbursement_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(id)
);

CREATE TABLE repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL,
    schedule_id UUID,
    reference_number VARCHAR(100) NOT NULL UNIQUE,
    amount NUMERIC(19,4) NOT NULL,
    principal_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    interest_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    provider VARCHAR(100),
    provider_reference VARCHAR(200),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_repayment_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(id),

    CONSTRAINT fk_repayment_schedule
        FOREIGN KEY (schedule_id)
        REFERENCES loan_schedules(id)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    customer_id UUID,
    loan_id UUID,
    transaction_type VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    amount NUMERIC(19,4) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'SZL',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    external_reference VARCHAR(200),
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT fk_transaction_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(id)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_type VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_mobile
    ON customers(mobile_number);

CREATE INDEX idx_loan_applications_customer
    ON loan_applications(customer_id);

CREATE INDEX idx_loan_applications_status
    ON loan_applications(status);

CREATE INDEX idx_loans_customer
    ON loans(customer_id);

CREATE INDEX idx_loans_status
    ON loans(status);

CREATE INDEX idx_loan_schedules_loan
    ON loan_schedules(loan_id);

CREATE INDEX idx_loan_schedules_due_date
    ON loan_schedules(due_date);

CREATE INDEX idx_repayments_loan
    ON repayments(loan_id);

CREATE INDEX idx_transactions_customer
    ON transactions(customer_id);

CREATE INDEX idx_transactions_loan
    ON transactions(loan_id);

CREATE INDEX idx_audit_logs_entity
    ON audit_logs(entity_type, entity_id);
