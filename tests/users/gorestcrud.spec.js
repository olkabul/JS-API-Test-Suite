import { test, expect, request } from "@playwright/test";
const baseURL = "https://gorest.co.in/public/v2";
const usersEp = "/users";
const token =
  "d5acdb268c2caae128c76d22b557c0d235092dc1bbc4ece6bdc18b65a2f1b222";
const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
};

test.describe("CRUD user operations", () => {
  let userId;

  test("create user", async ({ request }) => {
    const response = await request.post(`${baseURL}${usersEp}`, {
      data: {
        name: "Masha Safonova",
        gender: "female",
        email: `masha.${Date.now()}@mail.ru`,
        status: "active",
      },
      headers,
    });
    expect(response.status()).toBe(201);
    const newUser = await response.json();
    userId = newUser.id;
    console.log(userId);
  });

  test("update user", async ({ request }) => {
    const response = await request.put(`${baseURL}${usersEp}/${userId}`, {
      data: {
        name: "Masha Safonova Brill",
        gender: "female",
      },
      headers,
    });
    expect(response.status()).toBe(200);
    console.log(await response.json());
  });

  test("verify user updated", async ({ request }) => {
    const response = await request.get(`${baseURL}${usersEp}/${userId}`, {
      headers,
    });
    const updatedUser = await response.json();
    console.log("User after update: ", updatedUser);
    expect(updatedUser.name).toBe("Masha Safonova Brill");
  });

  test("delete user", async ({ request }) => {
    const response = await request.delete(`${baseURL}${usersEp}/${userId}`, {
      headers,
    });
    expect(response.status()).toBe(204);
  });

  test("verify the user removed", async ({ request }) => {
    const response = await request.delete(`${baseURL}${usersEp}/${userId}`, {
      headers,
    });
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.message).toBe("Resource not found");
  });
});

async function deleteUser(request, userId) {
  const response = await request.delete(`${baseURL}${usersEp}/${userId}`, {
    headers,
  });
  console.log(`Deleted user ${userId}, status: ${response.status()}`);
  expect([204, 404]).toContain(response.status());
}

test("bulk delete .ru users", async ({ request }) => {
  const response = await request.get(`${baseURL}${usersEp}?per_page=100`, {
    headers,
  });

  const users = await response.json();
  const ruUsers = users.filter((user) => user.email.endsWith(".ru"));
  console.log("Found", ruUsers.length, ".ru users");

  for (const user of ruUsers) {
    await deleteUser(request, user.id);
  }
});
