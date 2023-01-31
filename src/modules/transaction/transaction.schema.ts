
//export type getTransactionSchemaT = { snumber: string, knumber: string, znumber: string, name_kassa: string, id_organization: number, id?: number, organization: object };

export const getTransactionSchema = {
    schema: {
        tags: ['transaction'],
        description: "get statistic from KOFD",
        type: "object",
        required: ["dateStart", "dateEnd"],
        querystring: {
            mode: { type: "string", description: "текущий/прошлый год/квартал/месяц/неделя/день. Например 'текущий день'. Если задано mode, то не нужно dateStart и dateEnd" },
            dateStart: { type: "string", format: "date-time" },
            dateEnd: { type: "string", format: "date-time" },
            knumber: { type: "array", items: { type: "string" } },
            BIN: { type: "array", items: { type: "string" } },
            loadOperations: { type: "boolean", description: "если true - в теле ответа загружается второй узел list со списком операций продаж/возвратов" }
        },
        response: {
            200: {
                description: "need JWT admin token",
                type: "object",
                properties: {
                    table: {
                        type: "object",
                        properties: {
                            sumSale: { type: "number" },
                            sumSaleCard: { type: "number" },
                            sumSaleCash: { type: "number" },
                            sumSaleMixed: { type: "number" },
                            sumReturn: { type: "number" },
                            sumReturnCard: { type: "number" },
                            sumReturnCash: { type: "number" },
                            sumReturnMixed: { type: "number" },
                            sumAll: { type: "number" },
                            sumAllCard: { type: "number" },
                            sumAllCash: { type: "number" },
                            sumAllMixed: { type: "number" },
                            countChecks: { type: "number" },
                            cashEject: { type: "number" },
                            dateStart: { type: "string", format: "date-time" },
                            dateEnd: { type: "string", format: "date-time" },
                            obj: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        sumSale: { type: "number" },
                                        sumSaleCard: { type: "number" },
                                        sumSaleCash: { type: "number" },
                                        sumSaleMixed: { type: "number" },
                                        sumReturn: { type: "number" },
                                        sumReturnCard: { type: "number" },
                                        sumReturnCash: { type: "number" },
                                        sumReturnMixed: { type: "number" },
                                        sumAll: { type: "number" },
                                        sumAllCard: { type: "number" },
                                        sumAllCash: { type: "number" },
                                        sumAllMixed: { type: "number" },
                                        countChecks: { type: "number" },
                                        cashEject: { type: "number" },
                                        dateStart: { type: "string", format: "date-time" },
                                        dateEnd: { type: "string", format: "date-time" },
                                        name_kassa: { type: "string" },
                                        knumber: { type: "string" },
                                        id_kassa: { type: "number" },
                                        id_organization: { type: "number" },
                                        BIN: { type: "string" },
                                    }
                                }
                            }
                        }
                    },
                    list: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                knumber: { type: "string" },
                                id_organization: { type: "number" },
                                name_kassa: { type: "string" },
                                id_kassa: { type: "number" },
                                BIN: { type: "string" },
                                typeOper: { type: "string" },
                                sum: { type: "number" },
                                typePay: { type: "string" },
                                id: { type: "string" },
                                date: { type: "string", format: "date-time" },
                                shift: { type: "number" },
                            }
                        }
                    }
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
                description: "Unauthorized",
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
    }, $id: "getTransactionSchema"
}

export const getTransactionCheckSchema = {
    schema: {
        tags: ['transaction'],
        description: "get check from KOFD",
        type: "object",
        required: ["id", "knumber", "BIN"],
        querystring: {
            id: { type: "string" },
            knumber: { type: "string" },
            BIN: { type: "string" },
        },
        response: {
            200: {
                description: "need JWT admin token",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        text: { type: "string" },
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
                    description: "Unauthorized",
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
    }, $id: "getTransactionCheckSchema"

}

export const transactionShemas = [
    getTransactionSchema,
    getTransactionCheckSchema
    //getTransactionSchema,
    //putTransactionSchema
]