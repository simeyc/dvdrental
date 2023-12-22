# Description

A solution for https://github.com/Sensoteq/technical-test-nodejs.

# Running the project

Build and run docker image:

- `docker build -t dvdrental .`
- `docker run -p 8989:5432 -e POSTGRES_PASSWORD=postgres -d dvdrental:latest`

Start the server on port 3000:

- `npm run start`

Example API calls:

- List films of a specified category: `curl localhost:3000/filmsByCategory?category_name=action`
- List films containing title text below length: `curl "localhost:3000/films?title=to&length=60"`
- Delete a customer: `curl -X DELETE localhost:3000/customers/1`
- Add a customer: `curl -X POST "localhost:3000/customers?store_id=1&first_name=Crash&last_name=Bandicoot&email=crash@wumpa.com&phone=1234&address=Sewer&address2=Speedway&district=N%20Sanity%20Beach&city_id=1&postal_code=ABC123"`
