import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";

function NavBar() {
  const navigate = useNavigate();
  const { userData } = useContext(UsersContext);
  const handleClickUser = function () {
    navigate("/userData");
  };
  return (
    <div>
      <nav className="flex justify-between mb-10 cursor-pointer">
        <h2 className="text-2xl font-bold">First Code Lab</h2>
        <ul className="flex gap-5">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <button>
              {userData.length != 0 ? (
                <div className="flex gap-4">
                  <NavLink
                    to={
                      (userData.type === "student" && "/user") ||
                      (userData.type === "instructor" && "instructor") ||
                      (userData.type === "admin" && "admin")
                    }
                  >
                    dashboard
                  </NavLink>
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      handleClickUser();
                    }}
                  >
                    {userData.name}
                  </p>
                </div>
              ) : (
                <NavLink to="/login">Log In</NavLink>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
