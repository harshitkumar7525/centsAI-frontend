import { createContext } from "react";

const UserContext = createContext({
  user: {
    id: "",
    username: "",
  },
  setUser: () => {},
});

export default UserContext;
