import { ChatResponse, Message } from 'ollama';
import { FunctionListService } from '../service/function-list-service';
import { ChatService } from '../service/chat-service'
import { ChatResponseAsyncIterator } from '../helper/types';

export interface ChatBody {
  message: string;
}

export class ChatController {
  private chatService: ChatService;
  private functionList: FunctionListService;

  constructor(chatService: ChatService, functionList: FunctionListService) {
    this.chatService = chatService;
    this.functionList = functionList;
  }

  public async handleUserMessage(message: string): Promise<ChatResponseAsyncIterator> {
     console.log(`Received message: ${message}`);

     var outputmessage: Message[] = [];

    const response = await this.chatService.getResponse(message);
    
    // Send the response back to the user
    var userMessage = "";
    if(response) {
      
      for (const tool of response.message.tool_calls) {
        const functionName: string = tool.function.name;
        console.log("");
        console.log("CALL TO >> " + functionName);
        console.log(tool.function.arguments);
        console.log("");
        const functionToCall = this.functionList.avaiableFunction[functionName];
        if(functionToCall) {
          const functionResponse = await functionToCall(tool.function.arguments);
          userMessage = userMessage + functionResponse + "\n";
        }
          
      }
    }

    if(userMessage === "") {
      userMessage = "Sorry, we cannot process that request.";
    }
    outputmessage.push({
      role : "user",
      content : userMessage
    });

    return this.chatService.finalResponse(outputmessage);
  }

}