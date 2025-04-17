import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import LogIn from "./pages/LogIn";
import NavBar from "./components/NavBar";
import User from "./pages/User";
import Instructor from "./pages/Instructor";
import Admin from "./pages/Admin";
import { useState } from "react";
import { GroupProvider } from "./context/GroupContext";
import { UsersProvider } from "./context/UsersContext";
import Logout from "./components/Logout";

function App() {
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : "";
  });

  return (
    <GroupProvider>
      <UsersProvider>
        <div className="p-5">
          <BrowserRouter>
            <NavBar userData={userData} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={<LogIn setUserData={setUserData} />}
              />
              <Route path="/user" element={<User userData={userData} />} />
              <Route
                path="/instructor"
                element={<Instructor userData={userData} />}
              />
              <Route path="/admin" element={<Admin userData={userData} />} />
              <Route
                path="/userData"
                element={<Logout userData={userData} />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </UsersProvider>
    </GroupProvider>
  );
}

export default App;
