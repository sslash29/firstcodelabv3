import { useNavigate } from "react-router-dom";
import { logEvent } from "../utils/logEvent";
import { useContext } from "react";
import { UsersContext } from "../context/UsersContext";

function Logout() {
  const navigate = useNavigate();
  const handleLogOut = function () {
    localStorage.setItem("userData", "");
    logEvent(`user has logged out`, userData.id);
    navigate("/login");
  };
  const { userData } = useContext(UsersContext);

  return (
    <div>
      <button
        className="bg-red-400 px-2 py-2 rounded hover:scale-105 cursor-pointer"
        onClick={() => handleLogOut()}
      >
        Log out
      </button>
    </div>
  );
}

export default Logout;
