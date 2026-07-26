import app from "./app.js";

try {
  const { default: config } = await import("./config/index.js");

  app.listen(config.port, () => {
    console.log(`server is listening at Port ${config.port}`);
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
