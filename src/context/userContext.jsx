import { createContext, useState } from "react";
import api from "../../apiCall.js"
export const UserContext = createContext({
  user: {
    id: "",
    username: "",
  },
  setUser: () => {},
  aiResponses: [],
  setAiResponses: () => {},
  userMessages: [],
  setUserMessages: () => {},
  api: () => {},
});
const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ id: "", username: "" });
  const [aiResponses, setAiResponses] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const contextValue = {
    user,
    setUser,
    aiResponses,
    setAiResponses,
    userMessages,
    setUserMessages,
    api,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
