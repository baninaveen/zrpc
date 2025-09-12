import { createZrpcClient } from '@avyaya/zrpc/core';
import {  appRouter, AppRouter } from './index'; 
import { proto } from './generated';
import { ZodError } from 'zod';

async function main() {
  console.log('Creating zRPC client with validation...');
  const client = createZrpcClient<AppRouter>(appRouter, 'localhost:50051');

  // --- 1. Test the successful case ---
  try {
    const helloResponse = await client.greeter.sayHello({ name: 'Barrackpore' });
    console.log('✅ Greeter Response:', helloResponse.message);
  } catch (error) {
    console.error('❌ Error calling server:', error);
  }
  
  console.log('\n--- 2. Testing validation with an INVALID request ---');
  try {
    // @ts-expect-error
    await client.greeter.sayHello({ name: 12345 });
  } catch (error) {
    // ✅ 2. CATCH AND HANDLE THE ZOD ERROR CORRECTLY
    console.log('✅ Successfully caught expected validation error!');
    if (error instanceof ZodError) {
      console.log('Error Details:', error.issues);
    } else {
      // Handle gRPC or other errors
      console.log('Caught other error:', error);
    }
  }
}

main();