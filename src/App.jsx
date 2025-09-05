import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteLayout from "./components/RouteLayout";
import ErrorPage from "./components/ErrorPage";
import UserContext from "./context/userContext";
import { useState } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat.jsx";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      }
    ],
  },
]);

function App() {
  const [user, setUser] = useState({
    id: "",
    username: "",
  });
  const [aiResponses, setAiResponses] = useState([]);
  const [userMessages, setUserMessages] = useState([]);

  const ctxVal = {
    user,
    setUser,
    aiResponses,
    setAiResponses,
    userMessages,
    setUserMessages,
  };

  return (
    <UserContext.Provider value={ctxVal}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
