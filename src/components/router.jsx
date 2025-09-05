import { createBrowserRouter } from "react-router-dom";
import RouteLayout from "./RouteLayout";
import ErrorPage from "./ErrorPage";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Contact from "../pages/Contact";
import Dashboard from "../pages/Dashboard";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> }, // Use index: true for the default child
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/chat", element: <Chat /> },
      { path: "/contact", element: <Contact /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
    ],
  },
]);

export default router;