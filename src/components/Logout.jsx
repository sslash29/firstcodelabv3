import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const handleLogOut = function () {
    localStorage.setItem("userData", "");
    navigate("/login");
  };

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
