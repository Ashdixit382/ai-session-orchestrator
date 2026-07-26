import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

const missing = Object.entries(env)
  .filter(([, value]) => value == null || value.trim() === "")
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${missing.join("\n")}`
  );
}

const port = Number(env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(
    "Invalid PORT. PORT must be an integer between 1 and 65535."
  );
}

const config = {
  port,
  mongoUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  openAIApiKey: env.OPENAI_API_KEY,
};

export default config;