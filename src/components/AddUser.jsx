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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Form submitted:", formData);

    const tableName =
      formData.type.charAt(0).toUpperCase() + formData.type.slice(1);
    let updatedCourses = {};

    // Fetch existing courses for users
    if (formData.type === "Users") {
      const { data: sessions, error: fetchError } = await supabase
        .from(tableName)
        .select("courses");

      if (fetchError) {
        console.error("❌ Error fetching sessions:", fetchError);
        return;
      }

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
    }

    // Insert the user
    const { data: insertUserData, error: insertUserError } = await supabase
      .from(tableName)
      .insert([
        {
          name: formData.name,
          password: formData.password,
          ...(formData.type === "Users" && { courses: updatedCourses }),
          type: formData.type === "Users" ? "student" : formData.type,
        },
      ])
      .select(); // to get the new user's ID

    if (insertUserError) {
      console.error("❌ Error inserting user:", insertUserError);
      return;
    }

    const userId = insertUserData?.[0]?.id;
    console.log("👤 User ID:", userId);

    // Check if group already exists
    const { data: existingGroup, error: groupCheckError } = await supabase
      .from("Group")
      .select("id")
      .eq("group_name", formData.group);

    if (groupCheckError) {
      console.error("❌ Error checking group:", groupCheckError);
      return;
    }

    if (existingGroup.length === 0) {
      const { error: insertGroupError } = await supabase
        .from("Group")
        .insert([{ group_name: formData.group }]);

      if (insertGroupError) {
        console.error("❌ Error inserting group:", insertGroupError);
        return;
      } else {
        console.log("✅ Group inserted");
      }
    } else {
      console.log("ℹ️ Group already exists");
    }

    // Only run extra logic for Users
    if (formData.type === "Users") {
      // Get group ID again
      const { data: groupData, error: groupError } = await supabase
        .from("Group")
        .select("id")
        .eq("group_name", formData.group);

      const groupId = groupData?.[0]?.id;
      console.log("👥 Group ID:", groupId);
      console.log(formData.group, typeof formData.group);
      // Get instructor whose groups contain this group
      const { data: insData, error: insError } = await supabase
        .from("Instructor")
        .select("id")
        .contains("groups", `{${formData.group}}`);
      const instructorId = insData?.[0]?.id;
      console.log(`[${formData.group}]`);
      console.log("👨‍🏫 Instructor ID:", instructorId);

      if (groupError) console.error("❌ Group fetch error:", groupError);
      if (insError) console.error("❌ Instructor fetch error:", insError);

      if (userId && groupId && instructorId) {
        const { error: groupUsersError } = await supabase
          .from("Group_users")
          .insert([
            {
              group_id: groupId,
              user_id: userId,
              instructor_id: instructorId,
            },
          ]);

        if (groupUsersError) {
          console.error(
            "❌ Error inserting into Group_users:",
            groupUsersError
          );
        } else {
          console.log("✅ Group_users inserted successfully!");
        }
      } else {
        console.error("❗ Missing one or more IDs:", {
          userId,
          groupId,
          instructorId,
        });
      }
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
            required
          />
          <datalist id="group-options">
            {groupList.map((group, index) => (
              <option key={index} value={group} />
            ))}
          </datalist>
          <p className=" text-sm">
            if group isn't created, it will be created automatically
          </p>
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
