


export const postOrgBody = {
    type: "object",
    required: ["BIN", "name_org"],
    properties: {
        id: { type: "number" },
        BIN: { type: "string" },
        name_org: { type: "string" },
    }
}


export type postOrgSchemaT = { BIN: string, name_org: string, id?: number }

export const postOrgSchema = {
    schema: {
        description: "post Organization",
        body: postOrgBody,
        response: {
            201: {
                description: "need JWT admin token",
                type: "object",
                properties: {
                    name_org: { type: "string" },
                    BIN: { type: "string" },
                    id: { type: "integer" },
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
    }, $id: "postOrgSchema"
}


export const getOrgSchema = {
    schema: {
        description: "get all organizations",
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
                description: "need JWT admin token",
                type: "array",
                properties: {
                    name_org: { type: "string" },
                    BIN: { type: "string" },
                    id: { type: "integer" },
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
    }, $id: "getOrgSchema"
}

export const putOrgBody = {
    type: "object",
    required: ["BIN"],
    properties: {
      name_org: { type: "string" },
      BIN: { type: "string" },
    }
  };
  
  export type putOrgSchemaT = { BIN: string, name_org: string, id?: number }
  
  export const putOrgSchema = {
    schema: 
      {
      description: "put org",
      body: putOrgBody,
      response: {
        200: {
          description: "need JWT auth",
          type: "object",
          properties: {
            BIN: { type: "string" },
            name_org: { type: "string" },
            id: { typt: "integer"},
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
    }, $id: "putOrgSchema"
  }


export const orgShemas = [
    postOrgSchema,
    getOrgSchema,
    putOrgSchema
]