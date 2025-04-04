import { NavLink } from "react-router-dom";

function NavBar({ userData }) {
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
                  <p>{userData.name}</p>
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
