import { marked } from "marked";
import type { Message } from "../types";

export default function Chat(message: Message) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full md:px-4`}
    >
      <div
        className={
          message.role === "user"
            ? `bg-slate-700 p-1 px-2 rounded max-w-3/`
            : `p-1 px-2 text-justify`
        }
      >
        <p
          dangerouslySetInnerHTML={{
            __html: marked(message.content).toString(),
          }}
        ></p>
      </div>
    </div>
  );
}
