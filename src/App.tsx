import axios from "axios";
import { useEffect, useState } from "react";
import type { Message } from "./types";
import { marked } from "marked";

function Chat(message: Message) {
  const renderMD = (content: string) => {
    try {
      const html = markdown(content);
      return typeof html === "string" ? html : "";
    } catch (e) {
      console.log(e);
      return content || "";
    }
  };

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className="bg-slate-500 p-1 px-2 rounded max-w-3/4 overflow-x-auto">
        <p
          dangerouslySetInnerHTML={{
            __html: marked(message.content),
          }}
        ></p>
      </div>
    </div>
  );
}

function App() {
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Hello user",
    },
  ]);

  const send = async () => {
    const { data } = await axios.post(
      `https://imissyougpt.onrender.com/api/chat/`,
      {
        messages: [
          {
            role: "user",
            content: chat,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    setChat("");
    const list = messages;
    list.push({
      role: "user",
      content: chat,
    });
    list.push({
      role: "system",
      content: data.response,
    });
    localStorage.setItem("messages", JSON.stringify(list));
  };

  useEffect(() => {
    setMessages(
      JSON.parse(
        localStorage.getItem("messages") ??
        JSON.stringify([
          {
            role: "system",
            content: "Hello user",
          },
        ]),
      ),
    );
  }, [localStorage.getItem("messages")]);

  return (
    <div className="bg-slate-900 text-white h-dvh w-dvw">
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col justify-center items-center">
          <h1>Welcome to my simple ChatBot</h1>
          <h3>No need to sign in, just use</h3>
        </div>
        <div className="flex flex-col bg-slate-500/25 gap-2 h-full w-full box-border p-4 overflow-y-scroll">
          {messages.map((m) => {
            return Chat(m);
          })}
        </div>
        <div className="flex w-full">
          <input
            className="w-full box-border outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setChat(e.target.value);
            }}
            value={chat}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                send();
              }
            }}
            placeholder="Enter your message here:"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
