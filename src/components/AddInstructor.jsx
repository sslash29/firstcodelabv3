import { useState } from "react";
import supabase from "../../supabase-client";

function AddInstructor() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    type: "Users",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    const tableName =
      formData.type.charAt(0).toUpperCase() + formData.type.slice(1);

    const { data, error } = await supabase.from(tableName).insert([
      {
        name: formData.name,
        password: formData.password,
        type: formData.type,
      },
    ]);

    if (error) console.error("Error inserting data:", error);

    console.log("Data inserted successfully:", data);
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
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
      >
        Submit
      </button>
    </form>
  );
}

export default AddInstructor;
