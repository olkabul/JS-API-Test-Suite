import { test, expect } from "@playwright/test";
import { getToken } from "../../auth";
import { generateUserData } from "../../utils/generateData";
import { faker } from "@faker-js/faker";
import { baseURL, endpoints } from "../../config";
const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
};

test.describe("CRUD user operations", () => {
  let userId;
  let updatedName;

  test("create user", async ({ request }) => {
    const userData = generateUserData();
    const response = await request.post(`${baseURL}${endpoints.users}`, {
      data: userData,
      headers,
    });
    expect(response.status()).toBe(201);
    const newUser = await response.json();
    userId = newUser.id;
  });

  test("update user", async ({ request }) => {
    updatedName = faker.person.fullName();
    const response = await request.put(
      `${baseURL}${endpoints.users}/${userId}`,
      {
        data: {
          name: updatedName,
        },
        headers,
      }
    );
    expect(response.status()).toBe(200);
  });

  test("verify user updated", async ({ request }) => {
    const response = await request.get(
      `${baseURL}${endpoints.users}/${userId}`,
      {
        headers,
      }
    );
    const updatedUser = await response.json();
    expect(updatedUser.name).toBe(updatedName);
  });

  test("delete user", async ({ request }) => {
    const response = await request.delete(
      `${baseURL}${endpoints.users}/${userId}`,
      {
        headers,
      }
    );
    expect(response.status()).toBe(204);
  });

  test("verify the user removed", async ({ request }) => {
    const response = await request.delete(
      `${baseURL}${endpoints.users}/${userId}`,
      {
        headers,
      }
    );
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.message).toBe("Resource not found");
  });
});
