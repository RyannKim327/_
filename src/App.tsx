import axios from "axios";
import { useEffect, useState } from "react";
import type { Message } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Chat from "./component/chat";

function App() {
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Hello user",
    },
  ]);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (sent || !chat.trim()) {
      return;
    }
    if (/\/clear/i.test(chat.trim())) {
      localStorage.setItem(
        "messages",
        JSON.stringify([
          {
            role: "system",
            content: "All messages are cleared.",
          },
        ]),
      );
      setChat("");
      return;
    }
    setSent(true);

    const list = [
      ...messages,
      {
        role: "user",
        content: chat,
      },
    ];
    setChat("");

    localStorage.setItem("messages", JSON.stringify(list));

    const { data } = await axios.post(
      `https://imissyougpt.onrender.com/api/chat/`,
      {
        messages: list,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const updated = [
      ...list,
      {
        role: "system",
        content: data.response,
      },
    ];

    localStorage.setItem("messages", JSON.stringify(updated));
    setSent(false);
  };

  // useEffect(() => {
  //   const a = () => {
  //     const selection = window.getSelection()?.toString();
  //     if (selection) {
  //       setChat(selection);
  //       send();
  //     }
  //   };
  //
  //   document.addEventListener("mouseup", a);
  //
  //   return () => {
  //     document.removeEventListener("mouseup", a);
  //   };
  // }, []);

  useEffect(() => {
    const saved = localStorage.getItem("messages");
    setMessages(
      saved
        ? JSON.parse(saved)
        : [
            {
              role: "system",
              content: "Hello user",
            },
          ],
    );
  }, [localStorage.getItem("messages"), sent]);

  return (
    <div className="bg-slate-900 text-white h-dvh w-dvw p-4 select-none">
      <div className="flex flex-col h-full w-full gap-1">
        <div className="flex flex-col justify-center items-center">
          <h1>ChinatGPT</h1>
        </div>
        <div className="flex flex-col bg-slate-700/25 gap-2 h-full w-full box-border overflow-y-scroll p-2 rounded-t-md">
          {messages.map((m) => {
            return Chat(m);
          })}
        </div>
        <div className="flex w-full p-2 items-end box-border bg-slate-800/25 px-4 rounded-b-md">
          <textarea
            autoFocus={true}
            className="w-full box-border outline-none resize-none leading-[1.5rem] max-h-[calc(1.5rem*5)]"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setChat(e.target.value);
            }}
            value={chat}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={sent ? "Typing reply" : "Enter your message here:"}
          ></textarea>
          <FontAwesomeIcon onClick={send} icon={faPaperPlane} />
        </div>
      </div>
    </div>
  );
}

export default App;
