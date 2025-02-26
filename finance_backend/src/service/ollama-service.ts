import { ChatResponseAsyncIterator } from "../helper/types";
import { AIModel } from "../models/ai-model";
import ollama, { Message, Tool, ChatResponse, ErrorResponse } from 'ollama';


export class OllamaService implements AIModel {
  
  
    chatURL: string;
    model: string;

    constructor(chatURL: string, model: string) {
        this.chatURL = chatURL;
        this.model = model;
    }

    public async chat(messages: Message[]): Promise<ChatResponseAsyncIterator> {
        const response =  await ollama.chat({
            model: this.model,
            messages: messages,
            stream: true,
            options: {
                temperature: 0.7
            }
        });
    

       return response;
    }

    async send(messages: Message[]): Promise<any> {
        const response =  await ollama.chat({
            model: this.model,
            messages: messages,
            stream: false,
            tools: await this.functionList()
        });
    

       return response;
    }


    async functionList(): Promise<Tool[]> {
        return [
            {
                "type": "function",
                "function": {
                    "name": "add_new",
                    "description": "Add a new financial transaction",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "amount": {
                                "type": "number",
                                "description": "The amount of the transaction. it's double value. must include decimal."
                            },
                            "currency": {
                                "type": "string",
                                "description": "The currency of the transaction. if user use $ , currency will be USD. S$ will be SGD."
                            },
                            "type": {
                                "type": "string",
                                "description": "The type of transaction, e.g. expend or income. If user buy, bought something, it should be in expend.",
                                "enum": ["expend", "income"]
                            },
                            "category": {
                                "type": "string",
                                "description": "The category of the transaction, e.g. food"
                            },
                            "merchant": {
                                "type": "string",
                                "description": "The merchant involved in the transaction. e.g. Walmart. If it cannot detect, put empty string ''. "
                            },
                            "date": {
                                "type": "string",
                                "description": "The date of the transaction. format is DD MMM YYYY, e.g. 01 Jan 2025"
                            },
                            "description": {
                                "type": "string",
                                "description": "Additional description of the transaction. If it cannot detect, it can be empty string ''"
                            }
                        },
                        "required": ["amount", "currency", "type", "category", "merchant", "date","description"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "total_amount",
                    "description": "Get the total amount of transactions within a specified category and date range",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "category": {
                                "type": "string",
                                "description": "The category of transactions to sum, e.g. food. It can empty. when empty put empty string ''. If user doesn't mention cateogry or say all , use empty string ''"
                            },
                            "from": {
                                "type": "string",
                                "description": "The start date of the range, e.g. 01 Jan 2025"
                            },
                            "to": {
                                "type": "string",
                                "description": "The end date of the range, e.g. 31 Jan 2025"
                            },
                            "type": {
                                "type": "string",
                                "description": "The type of transaction, e.g. expend or income",
                                "enum": ["expend", "income"]
                            }
                        },
                        "required": ["category","from", "to", "type"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "category_list",
                    "description": "Get a list of all categories",
                    "parameters": {
                        "type": "object",
                        "required": [],
                        "properties": {}
                    },
                }
            },
            {
                "type" : "function",
                "function": {
                    "name" : "show_transaction_list",
                    "description": "Get a list of transactions within a specified date range",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "from": {
                                "type": "string",
                                "description": "The start date of the range, e.g. 01 Jan 2025"
                            },
                            "to": {
                                "type": "string",
                                "description": "The end date of the range, e.g. 31 Jan 2025"
                            }
                        },
                        "required": ["from", "to"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "total_list_by_category_type",
                    "description": "Get a list of total amounts by category and type within a specified date range",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "from": {
                                "type": "string",
                                "description": "The start date of the range, e.g. 01 Jan 2025"
                            },
                            "to": {
                                "type": "string",
                                "description": "The end date of the range, e.g. 31 Jan 2025"
                            },
                            "type": {
                                "type": "string",
                                "description": "The type of transaction, e.g. expend or income",
                                "enum": ["expend", "income"]
                            }
                        },
                        "required": ["from", "to", "type"]
                    }
                }
            }
        ]
    }

    
    
}