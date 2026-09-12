import conversationQueue from "../queues/conversation.queue.js";

export const getJobStatus = async (jobId, userId) => {
  const job = await conversationQueue.getJob(jobId);

  if (!job) {
    return null;
  }

  if (job.data.userId !== userId.toString()) {
    return null;
  }

  const state = await job.getState();

  return {
    id: job.id,
    name: job.name,
    state,
    progress: job.progress,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
    returnvalue: job.returnvalue,
  };
};
