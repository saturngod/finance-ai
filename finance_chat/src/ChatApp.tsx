import { useState, useEffect } from 'react';
import './App.css';
import Markdown from 'react-markdown';

function ChatApp() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleSend = async () => {
    if (input.trim()) {

        var datas = [...messages, input, 'Loading...'];
      setMessages(datas);
      setInput('');

      const response = await fetch('http://localhost:3000/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      var isFirstChunk = true;
      var latestString = "";
      while (!done) {
        const { value, done: doneReading } = await reader?.read()!;
        done = doneReading;
        const chunk = decoder.decode(value);
        if(isFirstChunk) {
            isFirstChunk = false;
            latestString = chunk;
            datas = [...datas, ];
            setMessages(prevMessages => [
                ...prevMessages.slice(0, prevMessages.length - 1),
                latestString
              ]);
        }
        else {
            latestString = latestString + chunk;
            datas = [...datas.slice(0, messages.length - 1), latestString];
            setMessages(prevMessages => [
                ...prevMessages.slice(0, prevMessages.length - 1),
                latestString
              ]);

        }
      }

      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        {messages.map((msg, index) => (
          <div key={index} className={index % 2 === 0 ? "chat-message" : "system-message"}>
            <Markdown>
            {msg}
            </Markdown>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="dark-mode-toggle">
        <label>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          Dark Mode
        </label>
      </div>
    </div>
  );
}

export default ChatApp;
