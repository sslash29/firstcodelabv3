import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setIsError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(UsersContext);

  async function checkUser(e) {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include", // still needed!
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const userData = await response.json();
      // You can now retrieve the token from cookies on the server side
      // No need to handle the token manually here, as it's stored in a cookie
      setUserData(userData);
      // Redirect based on user role
      if (userData.role === "student") navigate("/user");
      if (userData.role === "instructor") navigate("/instructor");
      if (userData.role === "admin") navigate("/admin");
    } else {
      setIsError("Invalid credentials");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Login
        </h2>
        <form onSubmit={(e) => checkUser(e)}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 text-right">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {error === null && (
          <p className="text-red-500 text-center">Wrong credentials</p>
        )}
      </div>
    </div>
  );
}

export default LogIn;
