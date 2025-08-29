import { createBrowserRouter,RouterProvider } from "react-router-dom";
import RouteLayout from "./components/RouteLayout";
import ErrorPage from "./components/ErrorPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    errorElement:<ErrorPage/>,
    children:[
      {
        path: "",
        element:<h1> Home Page</h1>
      }
    ],
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App;
