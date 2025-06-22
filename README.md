# GoRest API Test Suite

This project contains a suite of automated API tests for the public [GoRest API](https://gorest.co.in/), written in JavaScript using [Playwright](https://playwright.dev/) and [Faker](https://fakerjs.dev/).  
It covers full CRUD scenarios for users and posts, including negative cases and validation of response structure.

---

## Tech Stack

- **Playwright** – test runner and HTTP client
- **Faker.js** – dynamic test data generation
- **AJV** – JSON schema validation
- **GitHub Actions** – Continuous Integration

---

## Setup Instructions

1. Clone the repo
2. Install dependencies - this will install:

   - `@playwright/test` – Playwright test runner and HTTP client
   - `@faker-js/faker` – Randomized test data
   - `ajv` + `ajv-formats` – JSON schema validation

   ```bash
   npm install
   ```

3. Create a `.token` file in the project root with your [GoRest API token](https://gorest.co.in/consumer/login):  
   **Plain text only**, no quotes or `TOKEN=` prefix:

   ```
   d5acdb268c2...
   ```

> Your token is ignored via `.gitignore` and **should not be committed**.

---

## Running Tests Locally

```bash
npm test
```

To view the test report in browser:

```bash
npm run report
```

You can also use:

```bash
npx playwright test
npx playwright show-report
```

...or run specific files or folders:

```bash
npx playwright test tests/users/gorestcrud.spec.js
```

```bash
npx playwright test posts
```

---

## Notes

- Tests are written against a **public API**, so occasional failures due to rate limits or server instability are possible.
- All test data is generated dynamically with `faker`, including unique names and emails.

---

## GitHub Actions (CI)

This project is CI-ready. Tests are automatically run on every push and pull request.

**Workflow Highlights:**

- Runs `npm install` and `npx playwright test` using the `TOKEN` from repository secrets
- Uploads the Playwright HTML report as an artifact

> Set your GoRest API token in GitHub as a secret named `TOKEN`.
