import { test, expect } from "@playwright/test";
import { baseURL, endpoints } from "../../config";

test.describe("API tests for users", async () => {
  let users;

  test.beforeAll("cet users in array", async ({ request }) => {
    const response = await request.get(`${baseURL}${endpoints.users}`);
    expect(response.ok()).toBe(true);
    users = await response.json();
    expect(Array.isArray(users)).toBe(true);
  });

  test("get all users and verify the data type", async () => {
    const user = users[0];
    expect(typeof user.id).toBe("number");
    expect(typeof user.name).toBe("string");
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
