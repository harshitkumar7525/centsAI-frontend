import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
function RouteLayout() {
  return (
    <>
      <Navbar />
      {/* container should cover the entire viewport */}
      <div className="flex-grow min-h-screen p-4 bg-gray-900 text-white">
        <Outlet />
      </div>
    </>
  );
}
export default RouteLayout;