import dotenv from "dotenv";

// Load environment variables from .env into process.env
dotenv.config();

const config = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  openAIApiKey: process.env.OPENAI_API_KEY,
}

export default config;