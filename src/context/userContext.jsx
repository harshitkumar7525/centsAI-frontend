import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../apiCall.js";

export const UserContext = createContext({
  user: { id: "", username: "" },
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const storedUser = jwtDecode(token);

        if (storedUser?.id && storedUser?.username) {
          setUser({ id: storedUser.id, username: storedUser.username });
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        window.location.href = "/signin";
      }
    }
  }, []);

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
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
