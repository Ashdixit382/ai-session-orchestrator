import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./database/connectDB.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start application");
    console.error(error);

    process.exit(1);
  }
};

startServer();
