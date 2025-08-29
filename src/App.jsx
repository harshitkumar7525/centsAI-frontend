import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteLayout from "./components/RouteLayout";
import ErrorPage from "./components/ErrorPage";
import UserContext from "./context/userContext";
import { useState } from "react";
import Home from "./pages/Home";
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
