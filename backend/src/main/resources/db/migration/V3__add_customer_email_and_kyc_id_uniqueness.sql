ALTER TABLE customers
    ADD CONSTRAINT uq_customers_email UNIQUE (email);

ALTER TABLE customer_kyc
    ADD CONSTRAINT uq_customer_kyc_id_number UNIQUE (id_number);
