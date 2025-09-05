import { RouterProvider } from "react-router-dom";
import router from "./components/router.jsx";
import UserContextProvider from "./context/userContext";

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}

export default App;
