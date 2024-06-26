# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## Requirements

- As an admin, I want to be able to generate a CSV report showing the values of all user investment holdings
  - Any new routes should be added to the **admin** service
  - The csv report should be sent to the `/export` route of the **investments** service
  - The investments `/export` route expects the following:
    - content-type as `application/json`
    - JSON object containing the report as csv string, i.e, `{csv: '|User|First Name|...'}`
  - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
  - The **Holding** property should be the name of the holding account given by the **financial-companies** service
  - The **Value** property can be calculated by `investmentTotal * investmentPercentage`
  - The new route in the admin service handling the generation of the csv report should return the csv as text with content type `text/csv`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages but there is no expectation to replace them)
- Make effective use of git

We prefer:

- Functional code
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes

All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around _1-2 hours_ working on it

## Deliverables

**Please make sure to update the readme with**:

- Your new routes
- How to run any additional scripts or tests you may have added
- Relating to the task please add answers to the following questions;
  1. How might you make this service more secure?
  2. How would you make this solution scale to millions of records?
  3. What else would you have liked to improve given more time?

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes

We have provided a series of routes

Investments - localhost:8081

- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082

- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083

- `/investments/:id` get an investment record by id
- `/generate-csv` get generated csv investment record

## Deliverable Task

### New route

Admin - localhost:8083

- `/generate-csv` get generated csv investment record

### Running Scripts

```bash
npm install
npm run develop
```

To run the test, using a different terminal only in the admin folder

```bash
npm run test
```

### Answers to Questions

1. How might you make this service more secure?

- **Dependency Updates:** Update dependencies to address security vulnerabilities. For instance, the request has been deprecated.
- **Authentication and Authorization:** Implement mechanisms to ensure only authorized users, such as admins, can access sensitive routes like `/generate-csv`.
- **Input Data Validation:** Validate input data to prevent injection attacks. Ensure that parameters, such as `id` in `/investments/:id`, are properly sanitized and validated. Using typescript, for instance, can help with type validations
- **HTTPS Usage:** Encrypt data transmitted between the client and server using HTTPS instead of HTTP. 


2. How would you make this solution scale to millions of records?

- **Optimize Database Queries:** Optimize database queries and indexing strategies for efficient data retrieval, especially for large datasets. This is considering the application is connected to a database(this will be the case in a commercially deployed API).
- **Caching Mechanisms:** Implement caching mechanisms to reduce database load and improve response times for frequently accessed data. A tool like Redis is best suited for this purpose.
- **Distribute Workload:** Distribute workload across multiple servers using load balancing techniques and tools like Kubernetes.
- **Asynchronous Processing:** Implement asynchronous processing for non-blocking tasks, such as fetching company details or generating CSV reports, to improve throughput and responsiveness.
- **Performance Monitoring:** Regularly monitor and analyze performance metrics to identify bottlenecks and areas for optimization.

3. What else would you have liked to improve given more time?

- **Pagination:** Implement pagination to limit the number of records returned per request. This prevents overwhelming the server and improves performance. 
- **Transition to TypeScript:** Transition the project to TypeScript to provide static typing, enhancing code robustness, and productivity.
- **Controller and Model Integration:** Introduce controllers to organize request handling logic and models to represent data structures, promoting separation of concerns and improving code maintainability.
- **Ramda.js Integration:** Utilize Ramda.js more to leverage functional programming utilities for simplifying operations like data transformation or filtering.
- **Integration Testing:** Implement integration tests to ensure the reliability and correctness of critical functionalities, such as generating the CSV report.
