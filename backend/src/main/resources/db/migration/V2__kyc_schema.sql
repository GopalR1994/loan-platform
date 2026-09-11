ALTER TABLE customer_kyc
    ADD COLUMN id_document_url VARCHAR(500),
    ADD COLUMN selfie_url VARCHAR(500),
    ADD COLUMN rejection_reason VARCHAR(500);

CREATE INDEX idx_customer_kyc_status
    ON customer_kyc(status);
