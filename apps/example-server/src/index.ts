import { createZrpcServer } from '@zrpc/core';
import { z } from 'zod';

// 1. Define the schemas for our RPC methods
const schemas = {
  SayHelloRequest: z.object({
    name: z.string(),
  }),
  SayHelloReply: z.object({
    message: z.string(),
  }),
  GetUserRequest: z.object({
    id: z.string(),
  }),
  GetUserReply: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
  }),
};

// 2. Define the service implementation with async functions
const services = {
  greeter: {
    async sayHello(input: z.infer<typeof schemas.SayHelloRequest>) {
      console.log(`Handling request for: ${input.name}`);
      const validatedInput = schemas.SayHelloRequest.parse(input);
      return {
        message: `Hello, ${validatedInput.name}!`,
      };
    },
  },
  userService: {
    async getUser(input: z.infer<typeof schemas.GetUserRequest>) {
      console.log(`Fetching user with ID: ${input.id}`);
      // In a real app, you would fetch from a database.
      // We'll return a mock user here.
      return {
        id: input.id,
        name: 'Puja Bhowmik',
        email: 'puja@example.com',
      };
    },
  },
};

// 3. Create and export the router object and its type
export const appRouter = { schemas, services };
export type AppRouter = typeof appRouter;

// 4. Create and start the server!
const server = createZrpcServer(appRouter, '0.0.0.0:50051');
server.start();