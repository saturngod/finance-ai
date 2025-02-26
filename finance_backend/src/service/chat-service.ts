import { ChatResponse, Message } from "ollama";
import { AIModel } from "../models/ai-model";
import { ChatResponseAsyncIterator } from "../helper/types";

export class ChatService {
    model: AIModel;
    constructor(model: AIModel) {
        this.model = model;
    }

    async getResponse(message: string): Promise<any> {
        var user = {
            "role": "user",
            "content": message
        }
        const response = await this.model.send([user]);
        return response;
    }

    async finalResponse(messages: Message[]): Promise<ChatResponseAsyncIterator> {
        var systemMessage: Message = {
            "role": "system",
            "content": "Just show user message and fix grammar only. Don't repharse. don't add new text."
        };
        messages.unshift(systemMessage);
        const response = await this.model.chat(messages);
        return response;
    }
    
    
}

