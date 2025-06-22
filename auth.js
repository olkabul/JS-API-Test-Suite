import fs from "fs";

export function getToken() {
  const tokenFromEnv = process.env.TOKEN;
  if (tokenFromEnv) return tokenFromEnv;

  try {
    const fileToken = fs.readFileSync(".token", "utf-8").trim();
    if (fileToken) return fileToken;
  } catch (err) {
    throw new Error(
      "No token found. Provide TOKEN env variable or create .token file"
    );
  }
  throw new Error("Token not found.");
}
