export const userSchema = {
  type: "object",
  required: ["id", "name", "email", "gender", "status"],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
    gender: { type: "string", enum: ["male", "female"] },
    status: { type: "string", enum: ["active", "inactive"] },
  },
  additionalProperties: true,
};
