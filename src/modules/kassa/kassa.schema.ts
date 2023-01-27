
export const postKassaBody = {
    type: "object",
    required: ["snumber", "knumber", "znumber", "name_kassa", "id_organization"],
    properties: {
        snumber: { type: "string" },
        knumber: { type: "string" },
        znumber: { type: "string" },
        name_kassa: { type: "string" },
        id_organization: { type: "integer" },
    }

}


export type postKassaSchemaT = { snumber: string, knumber: string, znumber: string, name_kassa: string, id_organization: number, id?: number, organization: object };

export const postKassaSchema = {
    schema: {
        tags: ['kassa'],
        description: "post kassa",
        body: postKassaBody,
        response: {
            201: {
                description: "need JWT admin token",
                type: "object",
                properties: {
                    snumber: { type: "string" },
                    knumber: { type: "string" },
                    znumber: { type: "string" },
                    name_kassa: { type: "string" },
                    id_organization: { type: "integer" },
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
    }, $id: "postKassaSchema"
}

// export const getKassaBody = {
//     type: "object",
//     required: ["email", "password"],
//     properties: {
//         email: { type: "string" },
//         password: { type: "string" }
//     }
// }

export const getKassaSchema = {
    schema: {
        tags: ['kassa'],
        description: "get kassa",
        required: [],
        querystring: {
            snumber: { type: "string" },
            knumber: { type: "string" },
            znumber: { type: "string" },
            name_kassa: { type: "string" },
            id_organization: { type: "integer" },
            id: { type: "integer" }
        },
        // components: {
        //     securitySchemes: {
        //         bearerAuth: {
        //             type: "http",
        //             scheme: "bearer",
        //             bearerFormat: "JWT"
        //         }
        //     }
        // },
        response: {
            200: {
                description: "need JWT admin token",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        snumber: { type: "string" },
                        knumber: { type: "string" },
                        znumber: { type: "string" },
                        name_kassa: { type: "string" },
                        id_organization: { type: "integer" },
                        id: { type: "integer" },
                    }
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
    }, $id: "getKassaSchema"
}

export const putKassaSchema = {
    schema: {
        tags: ['kassa'],
        description: "put kassa",
        type: "object",
        required: ["id"],
        properties: {
            snumber: { type: "string" },
            knumber: { type: "string" },
            znumber: { type: "string" },
            name_kassa: { type: "string" },
            id_organization: { type: "integer" },
            id: { type: "integer" }
        },
         response: {
            200: {
                description: "need JWT admin token and id",
                type: "object",
                properties: {
                    snumber: { type: "string" },
                    knumber: { type: "string" },
                    znumber: { type: "string" },
                    name_kassa: { type: "string" },
                    id_organization: { type: "integer" },
                    id: { type: "integer" },
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
    }, $id: "putKassaSchema"
}


export const kassaShemas = [
    postKassaSchema,
    getKassaSchema,
    putKassaSchema
]