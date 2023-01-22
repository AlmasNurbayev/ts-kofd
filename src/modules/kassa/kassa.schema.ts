
export type createKassaSchemaT = { snumber: string; knumber: string; znumber: string; name_kassa: string; id_organization: number };

export const createKassaBody = {
    type: "object",
    required: ["snumber", "knumber", "znumber", "name_kassa", "id_organization"],
    properties: {
        snumber: { type: "string" },
        knumber: { type: "string" },
        znumber: { type: "string" },
        name_kassa: { type: "string" },
        id_organization: { type: "integer" }
    }
};

export const createKassaSchema = {
    schema: {
        description: "post kassa",
        body: createKassaBody,
        response: {
            201: {
                description: "successfull response",
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
    }
}

export const getKassaSchema = {
    schema: {
        description: "get all kassa, return array of objects",
        //body: getUsersBody,
        response: {
            200: {
                description: "success response",
                type: "array",
                items: {
                    snumber: { type: "string" },
                    knumber: { type: "string" },
                    znumber: { type: "string" },
                    name_kassa: { type: "string" },
                    id_organization: { type: "integer" },
                    id: { type: "integer" },
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


export type getKassaSchemaT = { snumber: string; knumber: string; znumber: string; name_kassa: string; id_organization: number; id: number };

