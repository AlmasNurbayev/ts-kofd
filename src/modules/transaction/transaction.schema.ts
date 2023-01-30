export const postTransactionBody = {
    type: "object",
    required: ["snumber", "knumber", "znumber", "name_kassa", "id_organization"],
    properties: {
        id: { type: "string" },
        onlineFiscalNumber: { type: "string" },
        offlineFiscalNumber: { type: "string" },
        systemDate: { type: "string", format: "date-time"},
        operationDate: { type: "string", format: "date-time"},
        type_operation: { type: "integer" },
        subType: { type: "integer" },
        sum_operation: { type: "number" },
        availableSum: { type: "number" },
        paymentTypes: { type: "string" },
        shift: { type: "integer" },
        uploadDate: { type: "string", format: "date-time"},
        organization: { type: "object" }, //virtual for prisma
        id_organization: { type: "integer" },
        kassa: { type: "object" }, // //virtual for prisma
        id_kassa: { type: "integer" },
    }
}

export type postTransactionSchemaT = { snumber: string, knumber: string, znumber: string, name_kassa: string, id_organization: number, id?: number, organization: object };

export const postTransactionSchema = {
    schema: {
        tags: ['transaction'],
        description: "post kassa",
        body: postTransactionBody,
        response: {
            201: {
                description: "need JWT admin token",
                type: "object",
                properties: {
                    id: { type: "string" },
                    onlineFiscalNumber: { type: "string" },
                    offlineFiscalNumber: { type: "string" },
                    systemDate: { type: "string", format: "date-time"},
                    operationDate: { type: "string", format: "date-time"},
                    type_operation: { type: "integer" },
                    subType: { type: "integer" },
                    sum_operation: { type: "number" },
                    availableSum: { type: "number" },
                    paymentTypes: { type: "string" },
                    shift: { type: "integer" },
                    uploadDate: { type: "string", format: "date-time"},
                    organization: { type: "object" }, //virtual for prisma
                    id_organization: { type: "integer" },
                    kassa: { type: "object" }, // //virtual for prisma
                    id_kassa: { type: "integer" },
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
    }, $id: "postTransactionSchema"
}

export const transactionShemas = [
    postTransactionSchema,
    //getTransactionSchema,
    //putTransactionSchema
]