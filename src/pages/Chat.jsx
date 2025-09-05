import "./chat.css";
import PromptInput from "../components/Chat/PromptInput";
function Chat() {
  return (
    <>
      <div className="fixed bottom-0 right-0 left-0 mb-4 flex justify-center">
        <PromptInput />
      </div>
    </>
  );
}

export default Chat;
