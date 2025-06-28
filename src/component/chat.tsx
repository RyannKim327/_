import { marked } from "marked";
import type { Message } from "../types";

export default function Chat(message: Message) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
    >
      <div
        className={
          message.role === "user"
            ? `bg-slate-700 p-1 px-2 rounded max-w-3/4`
            : `p-1 px-2 max-w-full`
        }
      >
        <p
          dangerouslySetInnerHTML={{
            __html: marked(message.content),
          }}
        ></p>
      </div>
    </div>
  );
}
