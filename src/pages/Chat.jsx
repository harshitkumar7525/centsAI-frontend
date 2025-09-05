import { useNavigate } from "react-router-dom";
import PromptInput from "../components/Chat/PromptInput";
import { useContext, useEffect } from "react";
import UserContext from "../context/userContext";

function Chat() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user.id === "") {
      alert("Kindly login to access the chat feature.");
      navigate("/signin");
    }
  }, []);
  return (
    <>
      <div className="fixed bottom-0 right-0 left-0 mb-4 flex justify-center">
        <PromptInput />
      </div>
    </>
  );
}

export default Chat;
