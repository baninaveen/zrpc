import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { z, ZodError, ZodType } from 'zod'


// --- TYPE DEFINITIONS ---
// Define the shape of the user's router
type ZodSchemas = Record<string, ZodType>;
type ServiceImplementation = Record<string, (input: any) => Promise<any>>;

interface ZrpcRouterShape {
    schemas: ZodSchemas;
    services: Record<string, ServiceImplementation>;
}

export type ZrpcRouter<T extends ZrpcRouterShape> = T;

export type CreateZrpcClient<TRouter extends ZrpcRouterShape> = {
    [TService in keyof TRouter['services']]: {
        [TMethod in keyof TRouter['services'][TService]]: (
            input: z.infer<TRouter['schemas'][`${Capitalize<TMethod & string>}Request`]>
        ) => Promise<z.infer<TRouter['schemas'][`${Capitalize<TMethod & string>}Reply`]>>;
    };
};

/**
 * Maps Zod types to Protocol Buffer types.
 * A simple implementation for demonstration.
 */
function zodToProtoType(type: ZodType): string {
    if (type instanceof z.ZodString) return 'string';
    if (type instanceof z.ZodNumber) return 'double';
    if (type instanceof z.ZodBoolean) return 'bool';
    // Note: This is simplified. A real implementation would need to handle
    // arrays (repeated), nested objects (other messages), enums, etc.
    return 'string'
}

/**
 * Generates a .proto schema string from the Zod router.
 */

// packages/core/src/index.ts

export const generateProtoFromRouter = (router: ZrpcRouterShape): string => {
    const parts: string[] = [];

    parts.push('syntax = "proto3";\n');
    parts.push('package zrpc;\n\n');

    // Generate Messages from Zod Schemas
    for (const schemaName in router.schemas) {
        const schema = router.schemas[schemaName];
        if (!(schema instanceof z.ZodObject)) continue;

        parts.push(`message ${schemaName} {\n`);
        let fieldIndex = 1;
        for (const key in schema.shape) {
            const fieldType = schema.shape[key];
            parts.push(`  ${zodToProtoType(fieldType)} ${key} = ${fieldIndex++};\n`);
        }
        parts.push('}\n\n');
    }

    // Generate Services from Service Definitions
    for (const serviceName in router.services) {
        parts.push(`service ${serviceName} {\n`);
        const service = router.services[serviceName];
        for (const methodName in service) {
            const reqMessage = `${methodName.charAt(0).toUpperCase() + methodName.slice(1)}Request`;
            const resMessage = `${methodName.charAt(0).toUpperCase() + methodName.slice(1)}Reply`;
            parts.push(`  rpc ${methodName} (${reqMessage}) returns (${resMessage});\n`);
        }
        parts.push('}\n\n');
    }

    return parts.join('');
}

/**  
 * Creates and configures a gRPC server from a zRPC router.
 */
export function createZrpcServer<TRouter extends ZrpcRouterShape>(router: TRouter, address: string) {
    const protoDefinition = generateProtoFromRouter(router);

    const tempProtoPath = path.join(os.tmpdir(), `zrpc_${Date.now()}.proto`);

    try {

        fs.writeFileSync(tempProtoPath, protoDefinition, { encoding: 'utf-8' });

        const packageDefinition = protoLoader.loadSync(tempProtoPath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

        const grpcObject = grpc.loadPackageDefinition(packageDefinition);
        const server = new grpc.Server();

        for (const serviceName in router.services) {
            const servicePackage = (grpcObject.zrpc as any);

            if (!servicePackage || !servicePackage[serviceName]) {
                throw new Error(`Service '${serviceName}' could not be found in the generated gRPC object.`);
            }
            const serviceDef = (grpcObject.zrpc as any)[serviceName].service;
            const serviceImpl = router.services[serviceName];
            const wrappedServiceImpl: { [key: string]: grpc.handleUnaryCall<any, any> } = {};

            for (const methodName in serviceImpl) {
                const methodImplementation = serviceImpl[methodName];
                if (methodImplementation) {
                    wrappedServiceImpl[methodName] = async (

                        call: grpc.ServerUnaryCall<any, any>,
                        callback: grpc.sendUnaryData<any>
                    ) => {
                        try {
                            const reqSchemaName = `${methodName.charAt(0).toUpperCase() + methodName.slice(1)}Request`;
                            const requestSchema = router.schemas[reqSchemaName];

                            if (!requestSchema) {
                                throw new Error(`Schema '${reqSchemaName}' not found for method '${methodName}'.`);
                            }

                            // This will throw a ZodError if validation fails
                            const validatedRequest = requestSchema.parse(call.request);

                            const result = await methodImplementation(validatedRequest);
                            callback(null, result);

                        } catch (error) {
                            // Catch Zod errors and convert them to gRPC errors
                            if (error instanceof ZodError) {
                                const status = grpc.status.INVALID_ARGUMENT;
                                const message = `Invalid request: ${error.issues.map(e => e.message).join(', ')}`;
                                callback({ code: status, details: message }, null);
                            } else {
                                // Handle other unexpected errors
                                const status = grpc.status.INTERNAL;
                                callback({ code: status, details: 'An internal server error occurred.' }, null);
                            }
                        }
                    };
                }
            }
            server.addService(serviceDef, wrappedServiceImpl);
        }

        return {
            start: () => {
                server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err: any, port: number) => {
                    if (err) {
                        console.error(`Server failed to bind: ${err}`);
                        return;
                    }
                    console.log(`🚀 zRPC server running at http://0.0.0.0:${port}`);
                    
                });
            },
            grpcServer: server,
        };
    } finally {
        // Clean up the temporary file
        if (fs.existsSync(tempProtoPath)) {
            fs.unlinkSync(tempProtoPath);
        }
    }
}

/**
 * Creates a fully type-safe zRPC client
 */
export function createZrpcClient<TRouter extends ZrpcRouterShape>(router: TRouter, address: string): CreateZrpcClient<TRouter> {
    // Generate the .proto definition string (same as server)
    const protoDefinition = generateProtoFromRouter(router);

    // Write proto to a temporary file and load it
    const tempProtoPath = path.join(os.tmpdir(), `zrpc_client_${Date.now()}.proto`);
    try {
        fs.writeFileSync(tempProtoPath, protoDefinition, { encoding: 'utf-8' });

        const packageDefinition = protoLoader.loadSync(tempProtoPath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

        const grpcObject = grpc.loadPackageDefinition(packageDefinition);
        const client: any = {};

        for (const serviceName in router.services) {
            const servicePackage = (grpcObject.zrpc as any);
            if (!servicePackage || !servicePackage[serviceName]) {
              throw new Error(`Client Error: Service '${serviceName}' not found in proto.`);
            }
            const GrpcClient = servicePackage[serviceName];
            const serviceClient = new GrpcClient(address, grpc.credentials.createInsecure());
            client[serviceName] = {};
      
            for (const methodName in router.services[serviceName]) {
              client[serviceName][methodName] = (request: any) => {
                // ✅ CLIENT-SIDE VALIDATION LOGIC IS HERE
                const reqSchemaName = `${methodName.charAt(0).toUpperCase() + methodName.slice(1)}Request`;
                const requestSchema = router.schemas[reqSchemaName];
                if (!requestSchema) {
                  return Promise.reject(new Error(`Client Error: Schema '${reqSchemaName}' not found.`));
                }
                
                try {
                  // This will throw a ZodError if the input is invalid, BEFORE the network call
                  requestSchema.parse(request);
                } catch (error) {
                  return Promise.reject(error);
                }
                // END OF VALIDATION
      
                return new Promise((resolve, reject) => {
                  const rpcMethodName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
                  serviceClient[rpcMethodName](request, (error: grpc.ServiceError, response: any) => {
                    if (error) { return reject(error); }
                    resolve(response);
                  });
                });
              };
            }
          }
          return client as CreateZrpcClient<TRouter>;
        } finally {
          if (fs.existsSync(tempProtoPath)) { fs.unlinkSync(tempProtoPath); }
        }
}