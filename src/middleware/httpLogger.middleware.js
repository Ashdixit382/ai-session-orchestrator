import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

const httpLogger = pinoHttp({
  logger,
});

export default httpLogger;
