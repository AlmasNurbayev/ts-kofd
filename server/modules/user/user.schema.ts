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

export type createUserSchemaT = { email: string; name: string; password: string };

export const createUserSchema = {
  schema:
  {
    tags: ['user'],
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
    tags: ['user'],
    description: "get all users, return array of objects",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    response: {

      200: {
        description: "need JWT token",
        type: "array",
        security: { "bearerAuth": [] },
        items: {
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
  }, $id: "getUsersSchema"
}

export type getUsersSchemaT = [{ id: number, email: string; name: string }];

//export { createUserSchema, createUserBody };

export const getUserBody = {
  email: { type: "string", description: "email as string without curly brackets" } //короткий вариант параметра
};

export type getUserSchemaT = { email: string; name: string; password: string; id: number; role: string };

export const getUserSchema = {
  schema: {
    tags: ['user'],
    description: "get once user",
    querystring: {
      email: { type: 'string', description: "like /api/user/get/?email=xxx@yyy.com" }
    },
    //params: getUserBody,
    response: {
      200: {
        description: "need JWT auth",
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
  }
}

export type loginUserSchemaT = { email: string, password: string, id: number };

export const loginUserSchema = {
  schema: {
    tags: ['user'],
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



export const putUserBody = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    name: { type: "string" },
    password: { type: "string" }
  }
};

export type putUserSchemaT = { email: string, name: string, password: string, id: number, role: string, salt: string };

export const putUserSchema = {
  schema:
  {
    tags: ['user'],
    description: "post user",
    body: putUserBody,
    response: {
      200: {
        description: "need JWT auth",
        type: "object",
        properties: {
          email: { type: "string" },
          name: { type: "string" },
          id: { typt: "integer" },
          role: { typt: "string" },
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
      401: {
        description: "forbidden",
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
  }, $id: "putUserSchema"
}

export type deleteUserSchemaT = { email: string; name: string; password: string; id: number; role: string };

export const deleteUserSchema = {
  schema: {
    tags: ['user'],
    description: "delete once user",
    querystring: {
      email: { type: 'string', description: "like /api/user/?email=xxx@yyy.com" }
    },
    //params: getUserBody,
    response: {
      200: {
        description: "need JWT auth",
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
  }, $id: "deleteUserSchema"
}



export const userShemas = [
  createUserSchema,
  getUsersSchema,
  getUserSchema,
  loginUserSchema,
  putUserSchema,
  deleteUserSchema
]