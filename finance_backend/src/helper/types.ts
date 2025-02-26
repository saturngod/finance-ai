import { ChatResponse } from "ollama";

type Abortable = { abort: () => void };

export interface ChatResponseAsyncIterator extends AsyncIterable<ChatResponse>, Abortable {}