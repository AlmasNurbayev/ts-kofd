import { type } from "os";

export const createUserBody = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    email: { type: "string" },
    name: { type: "string" },
    password: { type: "string" }
  }
};

export type createUserSchemaT = {email: string; name: string; password: string};

export const createUserSchema = {
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


export const getUsersSchema = {
  schema: {
    description: "get all users, return array of objects",
    //body: getUsersBody,
    response: {
      200: {
        description: "success response",
        type: "array",
        items:  {
          type: "object",
          properties: {
          id: { type: "integer" },
          email: { type: "string" },
          name: { type: "string" },
          password: { type: "string" },
          salt: { type: "string" }
        }
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

export type getUsersSchemaT = [{id: number, email: string; name: string}];

//export { createUserSchema, createUserBody };

export const getUserBody = {
  type: "object",
  required: ["email"],
  properties: {
    email: { type: "string" },
  }
};

// export const getUserBody = {
//   type: "string",
//   required: "email",
//   properties: {email: {type: "string"}}
  
// };


export type getUserSchemaT = {email: string; name: string; password: string; id: number};

export const getUserSchema = {
  schema: {
    description: "get once user",
    params: getUserBody,
    response: {
      200: {
        description: "successfull response",
        type: "object",
        properties: {
          password: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
          id: { type: "integer" }
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