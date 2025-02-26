import { Elysia } from "elysia";
import { ChatController, ChatBody } from "./controller/chat-controller";
import { ChatService } from "./service/chat-service";
import { OllamaService } from "./service/ollama-service";
import { FunctionListService } from "./service/function-list-service";
import { ChatResponse } from "ollama";
import { cors } from '@elysiajs/cors'
import { ChatResponseAsyncIterator } from "./helper/types";

const model = new OllamaService("http://127.0.0.1:11434/api/chat","llama3.2");

const chatService = new ChatService(model);
const functionList = new FunctionListService();
const chatController = new ChatController(chatService, functionList);

const app = new Elysia()
.get("/", () => "Hello AI")
.post("/message", async function* ({body} : {body: ChatBody}) {
  const response: ChatResponseAsyncIterator =  await chatController.handleUserMessage(body.message);
  for await (const part of response) {
    yield (part.message.content);
  }
})
.use(cors())
.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
