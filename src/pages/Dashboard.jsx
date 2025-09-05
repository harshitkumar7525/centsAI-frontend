import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user.id === "") {
      alert("Kindly login to access the dashboard.");
      navigate("/signin");
    }
  }, [user]);
  return <div>Dashboard</div>;
}

export default Dashboard;
