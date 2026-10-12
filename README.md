# AI Session Orchestrator

A production-oriented backend for AI-powered conversations, built with
Node.js, Express, MongoDB, Redis, BullMQ, and Socket.IO. The project
focuses on reliable asynchronous AI processing, conversation
consistency, provider abstraction, and real-time response delivery.

> **Status:** Core backend features implemented. Docker, CI/CD, and
> cloud deployment are planned next.

## Key Features

-   **Authentication and authorization:** JWT-based authentication and
    conversation ownership checks.
-   **Conversation and message APIs:** Create and manage conversations
    and messages.
-   **Cursor-based pagination:** Fetch messages incrementally using a
    cursor, with `hasMore` and `nextCursor` metadata.
-   **AI provider abstraction:** A common provider interface with OpenAI
    and mock implementations, selected through a provider factory.
-   **Provider fallback:** Retryable primary-provider failures can
    trigger a configured fallback provider for both AI responses and
    conversation titles. The mock provider is intended for
    development/testing, not as a production-quality AI alternative.
-   **Asynchronous processing:** BullMQ jobs process AI requests in a
    separate worker instead of blocking the API request.
-   **Real-time updates:** Socket.IO and Redis Pub/Sub deliver AI
    response and error events to connected clients.
-   **Conversation sequence ordering:** Sequence numbers and
    `processedSequence` prevent later jobs from being processed ahead of
    earlier messages.
-   **Distributed locking:** Redis locks use ownership tokens and
    periodic renewal to reduce concurrent processing of the same
    conversation.
-   **Retry and failure handling:** Provider errors are classified as
    retryable or permanent; permanent errors can bypass BullMQ retries.
    Failed jobs update message status and conversation progress
    atomically using a MongoDB transaction.
-   **Idempotency protection:** Existing assistant replies are checked
    before generation, and duplicate-key handling avoids creating
    duplicate assistant messages.
-   **Graceful worker shutdown:** The worker closes its queue connection
    and database resources on shutdown signals.
-   **Input validation:** Request payloads and MongoDB ObjectIds are
    validated.

## Architecture Overview

``` text
Client
  |
  v
Express API -----> MongoDB
  |                   ^
  | enqueue AI job    | messages / conversation state
  v                   |
Redis / BullMQ ----> AI Worker
                       |
                       v
                AI Provider Layer
                 |            |
               OpenAI       Mock
                       |
                       v
                 Redis Pub/Sub
                       |
                       v
                 Socket.IO
                       |
                       v
                     Client
```

The API and worker run as separate processes. BullMQ uses Redis for
background jobs; Redis Pub/Sub carries real-time events to the Socket.IO
layer. MongoDB stores conversations and messages.

## Engineering Challenges Addressed

### 1. Preserving message order with asynchronous jobs

Jobs can be picked up concurrently or out of order. Each message
receives a sequence number, and the worker checks it against
`processedSequence`. A job that is not ready is delayed rather than
processed prematurely.

### 2. Preventing concurrent processing

A Redis distributed lock is acquired per conversation. The lock uses an
ownership token, is renewed during longer AI calls, and is released only
by its owner.

### 3. Handling retries without duplicate assistant messages

The system checks for an existing assistant response linked to the user
message and handles duplicate-key errors. This helps prevent repeated
job attempts from creating duplicate replies.

### 4. Distinguishing transient and permanent provider failures

Provider errors include status and retryability information. Transient
failures can be retried or routed to the configured fallback provider,
while permanent errors avoid pointless retries.

### 5. Keeping conversation state consistent after failure

When a job reaches a terminal failure, the message failure state and
sequence advancement are updated within a MongoDB transaction. The
real-time error event is published after the transaction succeeds.

### 6. Separating request handling from AI generation

The API enqueues work and the worker performs generation. This keeps
potentially slow AI calls out of the main request path and supports
independent worker concurrency.

## Technology Stack

-   **Runtime:** Node.js (ES modules)
-   **API:** Express
-   **Database:** MongoDB, Mongoose
-   **Authentication:** JWT, bcrypt
-   **Background jobs:** BullMQ
-   **Queue and Pub/Sub infrastructure:** Redis
-   **Real-time communication:** Socket.IO
-   **Validation:** Zod
-   **AI integration:** OpenAI API, provider abstraction, mock provider

## Configuration

Create a local `.env` file. Never commit real secrets.

``` env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-session-orchestrator
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=your_openai_api_key
AI_PROVIDER=openai
AI_FALLBACK_PROVIDER=mock
```

Use the variable names expected by the project's `config/index.js`.
MongoDB and Redis must be running and reachable by the API and worker.
The `mock` fallback is useful for testing fallback behavior; configure a
real supported secondary provider before relying on fallback in
production.

## Running Locally

1.  Install dependencies:

    ``` bash
    npm install
    ```

2.  Start MongoDB and Redis locally, and configure `.env`.

3.  Start the API using the project's development script:

    ``` bash
    npm run dev
    ```

4.  Start the AI worker in a separate terminal using the worker script
    defined in `package.json`.

Check `package.json` for the exact worker command and available scripts.
API and worker processes must both be running for queued AI jobs to be
processed.

## Reliability Notes

-   A provider fallback is not the same as BullMQ retry: fallback tries
    another provider within the same processing attempt; BullMQ retries
    the job according to its queue configuration.
-   The mock provider returns a synthetic response and does not provide
    real AI generation.
-   MongoDB transactions require a transaction-capable deployment, such
    as a replica set; MongoDB Atlas supports this.
-   Docker, deployment automation, production observability, and a real
    secondary AI provider are future improvements.

## Repository

Source code: https://github.com/Ashdixit382/ai-session-orchestrator
