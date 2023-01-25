import { type } from "os";
import { server } from "../../app";

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
  schema: 
    {
        
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
  }, $id: "createUserSchema"
}


export const getUsersSchema = {
//  preHandler: getUsersPrehandler,
  schema: {
     description: "get all users, return array of objects",
     components:{
     securitySchemes: {
       bearerAuth: {  
         type: "http",
         scheme: "bearer",
         bearerFormat: "JWT"  }}},
     response: {
      
      200: {
        description: "need JWT token",
        type: "array",
        security: {"bearerAuth": []},
        items:  {
          type: "object",
          properties: {
          id: { type: "integer" },
          email: { type: "string" },
          name: { type: "string" },
          role: { type: "string" }
          //password: { type: "string" },
          //salt: { type: "string" }
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
  },    $id: "getUsersSchema"    
}

export type getUsersSchemaT = [{id: number, email: string; name: string}];

//export { createUserSchema, createUserBody };

export const getUserBody = {
  email: {type: "string", description: "email as string without curly brackets"} //короткий вариант параметра
  // type: "object",
  // required: ["email"],
  // properties: {
  //   email: { type: "string", description: "email as string without curly brackets"},
  // }
};

// export const getUserBody = {
//   type: "string",
//   required: "email",
//   properties: {email: {type: "string"}}
  
// };


export type getUserSchemaT = {email: string; name: string; password: string; id: number; role: string};

export const getUserSchema = {
  schema: {
    description: "get once user",
    querystring: {
      email: { type: 'string', description: "like /api/user/get/?email=xxx@yyy.com"}},    
    //params: getUserBody,
    response: {
      200: {
        description: "successfull response",
        type: "object",
        properties: {
          //password: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
          id: { type: "integer" },
          role: { type: "string" },
        }
      },
      404: {
        description: "bad request",
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
  }, $id: "getUserSchema"
}

export const loginUserBody = {
  type: "object",
required: ["email", "password"],
properties: {
  email: { type: "string" },
  password: { type: "string" }
}}

export type loginUserSchemaT = {email: string, password: string};

export const loginUserSchema = {
  schema: {
    description: "login user",
    body: loginUserBody,
    response: {
      200: {
        description: "successfull auth",
        type: "object",
        properties: {
          email: { type: "string" },
          accessToken: { type: "string" },
          //name: { type: "string" }
        }
      },
      400: {
        description: "not valid auth data",
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
        }
      },
      401: {
        description: "incorrect email / password",
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
  }, $id: "loginUserSchema"
}


export const userShemas = [
  createUserSchema, 
  getUsersSchema,
  getUserSchema,
  loginUserSchema
]





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