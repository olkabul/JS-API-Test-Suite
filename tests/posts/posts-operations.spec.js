import { test, expect } from "@playwright/test";
import { baseURL, endpoints } from "../../config";
import { generatePostData, generateUserData } from "../../utils/generateData";
import { getToken } from "../../auth";
const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
};

test.describe("posts operations", () => {
  let userId;
  let postId;

  test.beforeAll("create a new user", async ({ request }) => {
    const userData = generateUserData();
    const response = await request.post(`${baseURL}${endpoints.users}`, {
      data: userData,
      headers,
    });
    expect(response.status()).toBe(201);
    const newUser = await response.json();
    userId = newUser.id;
  });

  test("create a post", async ({ request }) => {
    const postContent = generatePostData(userId);
    const response = await request.post(`${baseURL}${endpoints.posts}`, {
      data: postContent,
      headers,
    });
    const newPost = await response.json();
    postId = newPost.id;
  });

  test("verify the content of the post", async ({ request }) => {
    const response = await request.get(
      `${baseURL}${endpoints.posts}/${postId}`,
      {
        headers,
      }
    );
    expect(response.ok()).toBe(true);
    const post = await response.json();
    expect(post.title.startsWith("title_")).toBe(true);
    expect(post.body.startsWith("body-")).toBe(true);
  });

  test("edit the post", async ({ request }) => {
    const response = await request.put(
      `${baseURL}${endpoints.posts}/${postId}`,
      {
        data: {
          title: `edited_title_.${Date.now()}`,
        },
        headers,
      }
    );
    expect(response.ok()).toBe(true);
    const editedPost = await response.json();
    expect(editedPost.title.startsWith("edited"));
    console.log("The post title after editing: ", editedPost.title);
  });

  test("delete the post", async ({ request }) => {
    const response = await request.delete(
      `${baseURL}${endpoints.posts}/${postId}`,
      {
        headers,
      }
    );
    expect(response.status()).toBe(204);
  });

  test("verify the post deleted", async ({ request }) => {
    const response = await request.get(
      `${baseURL}${endpoints.posts}/${postId}`,
      {
        headers,
      }
    );
    expect(response.status()).toBe(404);
  });

  test("ceate a post without user ID (negative)", async ({ request }) => {
    const response = await request.post(`${baseURL}${endpoints.posts}`, {
      data: {
        title: `title_${Date.now()}`,
        body: `body-text_${Date.now()}`,
      },
      headers,
    });
    expect(response.status()).toBe(422);
  });

  test.afterAll("delete the user created for the test", async ({ request }) => {
    const response = await request.delete(
      `${baseURL}${endpoints.users}/${userId}`,
      {
        headers,
      }
    );
    expect(response.status()).toBe(204);
    console.log("The user was deleted: ", userId);
  });
});
