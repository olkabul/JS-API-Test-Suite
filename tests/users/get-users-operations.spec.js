import { test, expect } from "@playwright/test";
import { baseURL, endpoints } from "../../config";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { userSchema } from "../schemas/user.schema";
const ajv = new Ajv();
addFormats(ajv);
const validateUser = ajv.compile(userSchema);

test.describe("API tests for users", async () => {
  let users;

  test.beforeAll("cet users in array", async ({ request }) => {
    const response = await request.get(`${baseURL}${endpoints.users}`);
    expect(response.ok()).toBe(true);
    users = await response.json();
    expect(Array.isArray(users)).toBe(true);
  });

  test("validate all users against user schema", async () => {
    users.forEach((user) => {
      const valid = validateUser(user);
      expect(valid).toBe(true);
      if (!valid) console.error(validateUser.errors);
    });
  });

  test("the name of user has at least 2 letters", async () => {
    users.forEach((user) => {
      expect(user.name.length > 1).toBe(true);
    });
  });

  test("user has valid email", async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    users.forEach((user) => {
      expect(emailRegex.test(user.email)).toBe(true);
    });
  });

  test("user's status is valid", async () => {
    const validStatuses = ["active", "inactive"];
    users.forEach((user) => {
      expect(validStatuses.includes(user.status)).toBe(true);
    });
  });

  test("user has a unique email address", async () => {
    const emails = [];
    users.forEach((user) => {
      emails.push(user.email);
    });
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size === emails.length).toBe(true);
  });
});
