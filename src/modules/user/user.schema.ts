import { type } from "os";

const createUserBody = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    email: { type: "string" },
    name: { type: "string" },
    password: { type: "string" }
  }
};

export type createUserSchemaT = {email: string; name: string; password: string};

const createUserSchema = {
  schema: {
    description: "post user",
    body: createUserBody,
    response: {
      201: {
        description: "successfull response",
        type: "object",
        properties: {
          email: { type: "string" },
          name: { type: "string" }
        }
      },
      400: {
        description: "error response",
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
        }
      },
      409: {
        description: "data already",
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
        }
      },
      500: {
        description: "unknown error",
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
        }
      }
    }
  }
}




export { createUserSchema, createUserBody };










// import { z } from "zod";
// import { buildJsonSchemas } from "fastify-zod";

// const userCore = {
//   email: z
//     .string({
//       required_error: "Email is required",
//       invalid_type_error: "Email must be a string",
//     })
//     .email(),
//   name: z.string(),
// };

// const createUserSchema = z.object({
//   ...userCore,
//   password: z.string({
//     required_error: "Password is required",
//     invalid_type_error: "Password must be a string",
//   }),
// });

// const createUserResponseSchema = z.object({
//   id: z.number(),
//   ...userCore,
// });

// const loginSchema = z.object({
//   email: z
//     .string({
//       required_error: "Email is required",
//       invalid_type_error: "Email must be a string",
//     })
//     .email(),
//   password: z.string(),
// });

// const loginResponseSchema = z.object({
//   accessToken: z.string(),
// });

// export type CreateUserInput = z.infer<typeof createUserSchema>;

// export type LoginInput = z.infer<typeof loginSchema>;

// export const { schemas: userSchemas, $ref } = buildJsonSchemas({
//   createUserSchema,
//   createUserResponseSchema,
//   loginSchema,
//   loginResponseSchema,
// });