export const postSchema = {
  type: "object",
  required: ["id", "user_id", "title", "body"],
  properties: {
    id: { type: "number" },
    user_id: { type: "number" },
    title: { type: "string" },
    body: { type: "string" },
  },
  additionalProperties: true,
};
