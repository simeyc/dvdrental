FROM sensoteq/tech-assessment-db:latest

# Copy db migration files; add run command to docker entrypoint script.
COPY database/ /tmp/database/
RUN echo "psql -U postgres -d dvdrental -a -f /tmp/database/NullableCustomerIdPaymentRental.sql" >> docker-entrypoint-initdb.d/restore-db.sh
