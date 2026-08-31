import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  AI_PROVIDER: process.env.AI_PROVIDER,
  AI_SYSTEM_PROMPT: process.env.AI_SYSTEM_PROMPT,
};

const missing = Object.entries(env)
  .filter(([, value]) => value == null || value.trim() === "")
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables:\n${missing.join("\n")}`);
}

const port = Number(env.PORT);
const bcryptSaltRounds = Number(env.BCRYPT_SALT_ROUNDS);
const refreshTokenExpiresIn = Number(env.REFRESH_TOKEN_EXPIRES_IN);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Invalid PORT. PORT must be an integer between 1 and 65535.");
}

const config = {
  port,
  mongoUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  openAIApiKey: env.OPENAI_API_KEY,
  bcryptSaltRounds,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  refreshTokenExpiresIn,
  aiProvider: env.AI_PROVIDER,
  aiSystemPrompt: env.AI_SYSTEM_PROMPT,
};

export default config;
