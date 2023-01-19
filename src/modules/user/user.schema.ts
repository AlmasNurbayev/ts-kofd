
const createUserBody = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email', 'password'],
  properties: {
    //id: { type: 'integer' },
    email: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' }
  }
};

//title: "user json for cipo kofd bot", - вынести в заголовок всех схем
//version: '1.0',

const createUserSchema = {
  schema: {
    response: {
      201: {
        body: createUserBody,
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