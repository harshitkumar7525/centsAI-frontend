import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteLayout from "./components/RouteLayout";
import ErrorPage from "./components/ErrorPage";
import UserContext from "./context/userContext";
import { useState } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat.jsx";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";

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
    ],
  },
]);

function App() {
  const [user, setUser] = useState({
    id: "",
    username: "",
  });

  const ctxVal = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={ctxVal}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
