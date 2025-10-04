<p align="center">
<svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177 42" height="200" width="250" style="flex justify-center items-center">
        <g style="opacity: 1;" id="logogram" transform="translate(63, 41) rotate(180) translate(31.5, 20) scale(1, -1) translate(-31.5, -20)"><path d="M63 29.3506L38.117 5.08907C37.4008 4.39081 36.4402 4 35.44 4C31.9983 4 30.2991 8.18294 32.7659 10.583L59.4712 36.5666C60.7577 37.8183 59.8715 40 58.0765 40H9.65685C8.59599 40 7.57857 39.5786 6.82843 38.8284L1.17157 33.1716C0.421426 32.4214 0 31.404 0 30.3431V10.6484L24.883 34.9109C25.5992 35.6092 26.5598 36 27.5601 36C31.0017 36 32.7009 31.8171 30.2342 29.417L3.52882 3.43345C2.24227 2.18166 3.12849 0 4.92354 0L53.3431 0C54.404 0 55.4214 0.421427 56.1716 1.17157L61.8284 6.82843C62.5786 7.57857 63 8.59599 63 9.65685V29.3506Z" fill="#D6770A"></path></g>
        <g style="opacity: 1;" id="logotype" transform="translate(69, 4)"><path fill="#1f5fe0" d="M27.06 33L6.63 33L6.63 32.33L16.89 16.08Q17.30 15.41 17.97 14.64L17.97 14.64L7.13 14.64L7.13 9.60L27.29 9.60L27.29 10.28L16.93 26.79Q16.57 27.33 16.08 27.96L16.08 27.96L27.06 27.96L27.06 33ZM36.64 33L30.34 33L30.34 1.50L40.52 1.50Q45.83 1.50 48.86 3.95Q51.90 6.41 51.90 11.04L51.90 11.04Q51.90 14.78 49.90 17.07Q47.89 19.37 44.34 20.13L44.34 20.13L53.16 33L45.73 33L39.03 23.01Q38.40 22.07 37.81 20.71L37.81 20.71L36.64 20.71L36.64 33ZM36.64 7.17L36.64 15.05L40.16 15.05Q42.72 15.05 44.11 14.03Q45.51 13.02 45.51 11.09L45.51 11.09Q45.51 9.20 44.11 8.18Q42.72 7.17 40.16 7.17L40.16 7.17L36.64 7.17ZM61.44 33L55.14 33L55.14 1.50L65.76 1.50Q71.07 1.50 74.11 4.00Q77.14 6.50 77.14 11.45L77.14 11.45Q77.14 16.44 74.11 19.01Q71.07 21.57 65.76 21.57L65.76 21.57L61.44 21.57L61.44 33ZM61.44 7.13L61.44 15.90L65.40 15.90Q67.97 15.90 69.36 14.82Q70.75 13.74 70.75 11.49L70.75 11.49Q70.75 9.24 69.36 8.18Q67.97 7.13 65.40 7.13L65.40 7.13L61.44 7.13ZM95.14 33.59L95.14 33.59Q91.63 33.59 88.64 32.33Q85.65 31.07 83.42 28.82Q81.19 26.57 79.96 23.62Q78.72 20.67 78.72 17.30L78.72 17.30Q78.72 13.92 79.91 10.95Q81.11 7.98 83.29 5.73Q85.47 3.48 88.48 2.20Q91.50 0.91 95.14 0.91L95.14 0.91Q99.02 0.91 101.78 2.13Q104.55 3.35 106.66 5.87L106.66 5.87L102.21 9.73Q99.38 6.77 95.14 6.77L95.14 6.77Q92.13 6.77 89.90 8.21Q87.67 9.64 86.46 12.03Q85.25 14.41 85.25 17.30L85.25 17.30Q85.25 20.18 86.46 22.54Q87.67 24.90 89.92 26.32Q92.17 27.73 95.28 27.73L95.28 27.73Q97.58 27.73 99.33 26.97Q101.08 26.20 102.48 24.68L102.48 24.68L107.07 28.59Q105.27 30.75 102.28 32.17Q99.28 33.59 95.14 33.59Z"></path></g>
      </svg></p>

[![npm version](https://img.shields.io/npm/v/zrpc.svg?color=blue&style=flat-square)](https://www.npmjs.com/package/zrpc)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)


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