import { createBrowserRouter,RouterProvider } from "react-router-dom";
import RouteLayout from "./components/RouteLayout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    children:[],
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App;
