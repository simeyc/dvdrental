-- Modify payment and rental tables to set customer_id null when a customer is deleted.

-- Modify payment table.
ALTER TABLE payment ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE payment DROP CONSTRAINT payment_customer_id_fkey;

ALTER TABLE payment 
ADD CONSTRAINT payment_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
ON UPDATE CASCADE ON DELETE SET NULL;

-- Modify rental table.
ALTER TABLE rental ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE rental DROP CONSTRAINT rental_customer_id_fkey;

ALTER TABLE rental 
ADD CONSTRAINT rental_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
ON UPDATE CASCADE ON DELETE SET NULL;
