import { test, expect, request } from "@playwright/test";
const baseURL = "https://gorest.co.in/public/v2";
const usersEp = "/users";
const postsEp = "/posts";
const token =
  "d5acdb268c2caae128c76d22b557c0d235092dc1bbc4ece6bdc18b65a2f1b222";
const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
};

test.describe("posts operations", () => {
  let userId;
  let postId;

  test.beforeAll("create a new user", async ({ request }) => {
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
    console.log("The user ID is ", userId);
  });

  test("Negative test: create a post without user ID", async ({ request }) => {
    const response = await request.post(`${baseURL}${postsEp}`, {
      data: {
        title: `title_${Date.now()}`,
        body: `body-text_${Date.now()}`,
      },
      headers,
    });
    expect(response.status()).toBe(422);
  });

  test("create a post", async ({ request }) => {
    const response = await request.post(`${baseURL}${postsEp}`, {
      data: {
        user_id: userId,
        title: `title_${Date.now()}`,
        body: `body-text_${Date.now()}`,
      },
      headers,
    });
    const newPost = await response.json();
    postId = newPost.id;
    console.log("the post id is: ", postId);
  });

  test("verify the content of the post", async ({ request }) => {
    const response = await request.get(`${baseURL}${postsEp}/${postId}`, {
      headers,
    });
    expect(response.ok()).toBe(true);
    const post = await response.json();
    expect(post.title.startsWith("title_")).toBe(true);
    expect(post.body.startsWith("body-")).toBe(true);
  });

  test("edit the post", async ({ request }) => {
    const response = await request.put(`${baseURL}${postsEp}/${postId}`, {
      data: {
        title: `edited_title_.${Date.now()}`,
      },
      headers,
    });
    expect(response.ok()).toBe(true);
    const editedPost = await response.json();
    expect(editedPost.title.startsWith("edited"));
    console.log("The post title after editing: ", editedPost.title);
  });

  test("delete the post", async ({ request }) => {
    const response = await request.delete(`${baseURL}${postsEp}/${postId}`, {
      headers,
    });
    expect(response.status()).toBe(204);
  });

  test("verify the post deleted", async ({ request }) => {
    const response = await request.get(`${baseURL}${postsEp}/${postId}`, {
      headers,
    });
    expect(response.status()).toBe(404);
  });

  test.afterAll("delete the user created for the test", async ({ request }) => {
    const response = await request.delete(`${baseURL}${usersEp}/${userId}`, {
      headers,
    });
    expect(response.status()).toBe(204);
    console.log("The user was deleted: ", userId);
  });
});
