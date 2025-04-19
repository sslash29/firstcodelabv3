import { useContext, useState } from "react";
import supabase from "../../supabase-client";
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

    let userData = null;
    const tables = ["Users", "Instructor", "Admin"];

    for (const table of tables) {
      const { data, error: queryError } = await supabase
        .from(table)
        .select("*")
        .eq("name", name)
        .maybeSingle();
      if (queryError) {
        console.error("Query error:", queryError);
        continue; // Move to the next table
      }

      if (!data) {
        console.log(`No user found in table: ${table}`);
        continue; // Move to the next table
      }

      console.dir(data);

      // Now it's safe to access data.password
      console.log(
        password,
        password.length,
        data.password,
        data.password.length
      );
      console.log(password === data.password);

      if (password === data.password) {
        userData = data;

        // Save to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        break;
      }
    }

    if (!userData) {
      console.log("User not found or incorrect password");
      setIsError(null);
      return;
    }

    setUserData(userData);
    console.log(userData);
    if (userData.type.toLowerCase() === "student") navigate("/user");
    if (userData.type.toLowerCase() === "instructor") navigate("/instructor");
    if (userData.type.toLowerCase() === "admin") navigate("/admin");
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
              placeholder="Enter your email"
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
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
        {error === null && (
          <p className=" text-red-500 text-center">wrong credentials</p>
        )}
      </div>
    </div>
  );
}

export default LogIn;
