import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Loadable from "./Loadable.jsx";
const RouteLayout = Loadable(lazy(() => import("./RouteLayout")));
const ErrorPage = Loadable(lazy(() => import("./ErrorPage")));
const Home = Loadable(lazy(() => import("../pages/Home")));
const Chat = Loadable(lazy(() => import("../pages/Chat")));
const Contact = Loadable(lazy(() => import("../pages/Contact")));
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const SignUp = Loadable(lazy(() => import("../pages/SignUp")));
const SignIn = Loadable(lazy(() => import("../pages/SignIn")));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "chat", element: <Chat /> },
      { path: "contact", element: <Contact /> },
      { path: "signup", element: <SignUp /> },
      { path: "signin", element: <SignIn /> },
    ],
  },
]);

export default router;
