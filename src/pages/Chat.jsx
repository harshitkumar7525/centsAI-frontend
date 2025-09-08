import { useNavigate } from "react-router-dom";
import PromptInput from "../components/Chat/PromptInput";
import { useContext, useEffect } from "react";
import {UserContext} from "../context/userContext";
import ChatBox from "../components/Chat/ChatBox";

function Chat() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user.id === "") {
      alert("Kindly login to access the chat feature.");
      navigate("/signin");
    }
  }, [user]);
  return (
    <> 
      <ChatBox />
      <div className="fixed sticky-bottom bottom-0 right-0 left-0 mb-4 flex justify-center">
        <PromptInput />
      </div>
    </>
  );
}

export default Chat;
