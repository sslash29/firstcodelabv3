import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

function ShowUserDetails({ userDetails }) {
  const [newUserDetails, setNewUserDetails] = useState(userDetails);
  const { name, password, courses, ratings } = newUserDetails;
  const [isEdit, setIsEdit] = useState(null);
  const [editValues, setEditValues] = useState({
    name: name,
    password: password,
  });

  console.log(userDetails);
  useEffect(() => {
    const channel = supabase
      .channel("users_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Users",
          filter: `id=eq.${newUserDetails.id}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          if (payload.eventType === "UPDATE") {
            setNewUserDetails((prev) => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newUserDetails]);

  if (!userDetails)
    return <p className="text-center text-gray-500">No user selected.</p>;

  const handleShowEditInput = (field) => {
    setIsEdit(field);
    setEditValues({ ...editValues, [field]: userDetails[field] || "" });
  };

  const handleChange = (e) => {
    setEditValues({ ...editValues, [isEdit]: e.target.value });
  };

  const handleCancel = () => {
    setIsEdit(null);
    setEditValues({
      name: name,
      password: password,
    });
  };

  const handleSubmitEditValues = async () => {
    if (!isEdit) return;

    const { data, error } = await supabase
      .from("Users")
      .update({ [isEdit]: editValues[isEdit] }) // Update only the edited field
      .eq("id", userDetails.id); // Assuming 'id' is the unique identifier for the user

    if (error) {
      console.error("Error updating user:", error.message);
    } else {
      console.log("User updated:", data);
      setIsEdit(null); // Close input after successful update
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details</h2>

      {/* Name Section */}
      <p className="text-lg flex gap-2">
        <span className="font-semibold">Name: {name}</span>
        <button
          onClick={() => handleShowEditInput("name")}
          className="cursor-pointer"
        >
          edit
        </button>
      </p>
      {isEdit === "name" && (
        <div className="flex gap-2">
          <input
            className="border outline-0"
            value={editValues.name}
            onChange={handleChange}
          />
          <button onClick={() => handleSubmitEditValues()}>submit</button>
          <button onClick={handleCancel}>close</button>
        </div>
      )}

      {/* Password Section */}
      <p className="text-lg flex gap-2">
        <span className="font-semibold">Password: {password}</span>
        <button
          onClick={() => handleShowEditInput("password")}
          className="cursor-pointer"
        >
          edit
        </button>
      </p>
      {isEdit === "password" && (
        <div className="flex gap-2">
          <input
            className="border outline-0"
            value={editValues.password}
            onChange={handleChange}
          />
          <button onClick={() => handleSubmitEditValues()}>submit</button>
          <button onClick={handleCancel}>close</button>
        </div>
      )}

      {/* Courses Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Enrolled Courses
        </h3>
        {courses ? (
          <div className="space-y-3">
            {Object.entries(courses).map(([courseName, details]) => (
              <div
                key={courseName}
                className="border p-4 rounded-lg bg-gray-100"
              >
                <p className="font-medium text-gray-900">{courseName}</p>
                <p className="text-sm text-gray-700">Group: {details.group}</p>
                <p className="text-sm text-gray-700">
                  Instructor: {details.instructor}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses enrolled.</p>
        )}
      </div>

      {/* Ratings Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Ratings</h3>
        {ratings ? (
          <div className="space-y-3">
            {Object.entries(ratings).map(([instructor, ratingDetails]) => (
              <div
                key={instructor}
                className="border p-4 rounded-lg bg-gray-100"
              >
                <p className="font-medium text-gray-900">
                  Instructor: {instructor.replace("_", " ")}
                </p>
                <p className="text-sm text-gray-700">
                  Overall: {ratingDetails.overall}/15
                </p>
                <p className="text-sm text-gray-700">
                  Explanation: {ratingDetails.explanation}/5
                </p>
                <p className="text-sm text-gray-700">
                  Homework: {ratingDetails.homework}/5
                </p>
                <p className="text-sm text-gray-700">
                  Recording: {ratingDetails.recording}/5
                </p>
                {ratingDetails.additionalText && (
                  <p className="text-sm italic text-gray-600">
                    "{ratingDetails.additionalText}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ratings available.</p>
        )}
      </div>
    </div>
  );
}

export default ShowUserDetails;
