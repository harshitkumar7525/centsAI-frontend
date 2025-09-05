import { createContext, useState } from "react";
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
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
