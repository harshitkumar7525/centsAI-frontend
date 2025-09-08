import { useContext } from "react";
import { UserContext } from "../../context/userContext";

function ChatBox() {
  const { chats } = useContext(UserContext);

  return (
    <>
      {chats.map((chat, index) => (
        <div
          key={index}
          className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xl mx-2 my-2 p-3 rounded-xl shadow-lg transition-transform transform ${
              chat.role === "user"
                ? "bg-indigo-600 text-white translate-x-1"
                : "bg-gray-700 text-gray-200 translate-x-[-1]"
            }`}
          >
            <p className="whitespace-pre-wrap">{chat.content}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatBox;