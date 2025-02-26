import { Message, ChatResponse } from "ollama";
import { ChatResponseAsyncIterator } from "../helper/types";

export interface AIModel {
    chatURL: string;
    model: string;
    send(messages: Message[]): any;
    chat(messages: Message[]): Promise<ChatResponseAsyncIterator>;

}