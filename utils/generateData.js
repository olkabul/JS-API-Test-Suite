import { faker } from "@faker-js/faker";

export function generateUserData() {
  return {
    name: faker.person.fullName(),
    gender: faker.helpers.arrayElement(["male", "female"]),
    email: faker.internet.email().toLowerCase(),
    status: faker.helpers.arrayElement(["active", "inactive"]),
  };
}

export function generatePostData(userId) {
  return {
    user_id: userId,
    title: `title_${faker.word.adjective()}_${Date.now()}`,
    body: `body-${faker.lorem.sentence()}`,
  };
}
