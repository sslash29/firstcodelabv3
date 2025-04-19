import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import LogIn from "./pages/LogIn";
import NavBar from "./components/NavBar";
import User from "./pages/User";
import Instructor from "./pages/Instructor";
import Admin from "./pages/Admin";
import { GroupProvider } from "./context/GroupContext";
import { UsersProvider } from "./context/UsersContext";
import Logout from "./components/Logout";
import Test from "./pages/Test";

function App() {
  return (
    <GroupProvider>
      <UsersProvider>
        <div className="p-5">
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/user" element={<User />} />
              <Route path="/instructor" element={<Instructor />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/test" element={<Test />} />
              <Route path="/userData" element={<Logout />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </UsersProvider>
    </GroupProvider>
  );
}

export default App;
