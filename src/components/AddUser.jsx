import { useContext, useState } from "react";
import { GroupContext } from "../context/GroupContext";
import supabase from "../../supabase-client";

function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    type: "Users",
    group: "",
  });

  const { groupList } = useContext(GroupContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  let updatedCourses = {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const tableName =
      formData.type.charAt(0).toUpperCase() + formData.type.slice(1);

    // Fetch existing sessions
    if (formData.type === "Users" || formData.type === "student") {
      const { data: sessions, error: fetchError } = await supabase
        .from(tableName)
        .select("courses");

      if (fetchError) {
        console.error("Error fetching sessions:", fetchError);
        return;
      }

      // Accumulate courses instead of replacing them
      sessions.forEach((session) => {
        if (session.courses && typeof session.courses === "object") {
          Object.entries(session.courses).forEach(
            ([courseName, courseDetails]) => {
              if (courseDetails.group === formData.group) {
                updatedCourses[courseName] = courseDetails;
              }
            }
          );
        }
      });
      console.dir("Fetched sessions:", sessions);
    }

    // Insert the new user with the accumulated courses
    const { data, error } = await supabase.from(tableName).insert([
      {
        name: formData.name,
        password: formData.password,
        ...(formData.type === "Users" && { courses: updatedCourses }),
        type: formData.type === "Users" ? "student" : formData.type,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-80">
      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block">Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="Users">Users</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {formData.type === "Users" && (
        <div>
          <label className="block">Group:</label>
          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
            list="group-options"
            className="border p-2 w-full"
          />
          <datalist id="group-options">
            {groupList.map((group, index) => (
              <option key={index} value={group} />
            ))}
          </datalist>
        </div>
      )}
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
      >
        Submit
      </button>
    </form>
  );
}

export default AddUser;
