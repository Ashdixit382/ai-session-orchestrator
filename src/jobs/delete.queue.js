import { Queue } from "bullmq";

const queues = ["conversation", "ai"];

for (const name of queues) {
  const queue = new Queue(name, {
    connection: {
      host: "localhost",
      port: 6379,
    },
  });

  await queue.obliterate({ force: true });

  await queue.close();

  console.log(`Deleted queue: ${name}`);
}

process.exit(0);
