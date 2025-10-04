✨ zRPC: The Missing Type-Safe gRPC Framework for Node.js
zRPC is a lightweight, developer-friendly framework that brings end-to-end type safety to gRPC in Node.js, without ever needing to write a .proto file. By leveraging the power of Zod for schema definition and validation, zRPC allows you to build robust, high-performance RPC APIs with a development experience similar to tRPC.

## Key Features
🚀 End-to-End Type Safety: Automatically infer client-side types directly from your server's router definition.

✍️ No .proto Files: Define your API contract once using Zod schemas in plain TypeScript.

✅ Automatic Validation: Built-in server-side and client-side validation powered by Zod.

🤝 Developer-Friendly: A simple, minimal API for creating servers and clients with modern async/await.

⚡ High Performance: Built on top of the native @grpc/grpc-js library, giving you all the performance benefits of gRPC and HTTP/2.

## Installation
Install the core library and the command-line tool.

```bash
pnpm add @avyaya/core @grpc/grpc-js zod
pnpm add -D @avyaya/cli
```
## Quick Start
Let's build a simple Greeter service in 3 steps.

### 1. Define Your Router
Create a central file to define your schemas and services. The router is the single source of truth for your API.

```bash
src/router.ts:
```

TypeScript

```typescript
import { z } from 'zod';

const schemas = {
  SayHelloRequest: z.object({
    name: z.string(),
  }),
  SayHelloReply: z.object({
    message: z.string(),
  }),
};

const services = {
  greeter: {
    async sayHello(input: z.infer<typeof schemas.SayHelloRequest>) {
      console.log(`Handling request for: ${input.name}`);
      return {
        message: `Hello, ${input.name}!`,
      };
    },
  },
};

export const appRouter = { schemas, services };
export type AppRouter = typeof appRouter;
```

### 2. Create the Server
Create a file to initialize and run your gRPC server.

```bash
src/server.ts:
```

```typescript
import { createZrpcServer } from '@avyaya/core';
import { appRouter } from './router';

const server = createZrpcServer(appRouter, '0.0.0.0:50051');
server.start();

console.log('🚀 Server running on port 50051');
```
### 3. Create the Client
Create a client to call your server. Notice how we only import the type of the AppRouter, not the runtime object, keeping the client fully decoupled.

```bash
src/client.ts:
```

```typescript
import { createZrpcClient } from '@avyaya/core';
import type { AppRouter } from './router'; // Import ONLY the type

async function main() {
  const client = createZrpcClient<AppRouter>({
    // In a real app, you would generate and import the proto string
    // For this quick start, we pass the router to generate it at runtime.
    router: appRouter,
    address: 'localhost:50051'
  });

  const response = await client.greeter.sayHello({ name: 'World' });

  console.log('✅ Server Response:', response.message);
  // Output: ✅ Server Response: Hello, World!
}

main();
```

## Contributing
Contributions are welcome! Please see the CONTRIBUTING.md file for guidelines on how to set up the development environment, run tests, and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

It's been a long and productive week of building here in Barrackpore. Congratulations on creating a fantastic open-source project!