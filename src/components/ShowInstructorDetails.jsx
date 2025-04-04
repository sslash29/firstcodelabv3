import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

function ShowInstructorDetails({ instructorDetails = {} }) {
  const [newInstructorDetails, setNewInstructorDetails] =
    useState(instructorDetails);
  const [isEdit, setIsEdit] = useState(null);
  const [editValues, setEditValues] = useState({
    name: newInstructorDetails.name || "",
    password: newInstructorDetails.password || "",
  });

  const ratings = newInstructorDetails.rating || {};
  const sessions = newInstructorDetails.session || {};
  const [additionalText, setAdditionalText] = useState("");

  useEffect(() => {
    if (!instructorDetails.id) return;

    const channel = supabase
      .channel("users_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Instructor",
          filter: `id=eq.${instructorDetails.id}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          if (payload.eventType === "UPDATE") {
            setNewInstructorDetails((prev) => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [instructorDetails.id]);

  const handleShowEditInput = (field) => {
    setIsEdit(field);
    setEditValues({
      ...editValues,
      [field]: newInstructorDetails[field] || "",
    });
  };

  const handleChange = (e) => {
    setEditValues({ ...editValues, [isEdit]: e.target.value });
  };

  const handleCancel = () => {
    setIsEdit(null);
    setEditValues({
      name: newInstructorDetails.name || "",
      password: newInstructorDetails.password || "",
    });
  };

  const handleSubmitEditValues = async () => {
    if (!isEdit) return;

    const { data, error } = await supabase
      .from("Instructor")
      .update({ [isEdit]: editValues[isEdit] }) // Update only the edited field
      .eq("id", newInstructorDetails.id);

    if (error) {
      console.error("Error updating user:", error.message);
    } else {
      console.log("User updated:", data);
      setIsEdit(null); // Close input after successful update
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center p-6 font-semibold gap-6 border rounded-lg shadow-lg w-[600px] bg-white">
        {/* Name Section */}
        <div>
          <h1 className="font-bold text-3xl text-center text-blue-600">
            {newInstructorDetails.name}
          </h1>
          <button
            onClick={() => handleShowEditInput("name")}
            className="cursor-pointer"
          >
            edit
          </button>
          {isEdit === "name" && (
            <div className="flex gap-2">
              <input
                className="border outline-0"
                value={editValues.name}
                onChange={handleChange}
              />
              <button onClick={handleSubmitEditValues}>submit</button>
              <button onClick={handleCancel}>close</button>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div>
          <p className="text-lg text-center text-gray-700">
            Password:
            <span className="font-mono text-gray-800">
              {" "}
              {newInstructorDetails.password}{" "}
            </span>
          </p>
          <button
            onClick={() => handleShowEditInput("password")}
            className="cursor-pointer"
          >
            edit
          </button>
          {isEdit === "password" && (
            <div className="flex gap-2">
              <input
                className="border outline-0"
                value={editValues.password}
                onChange={handleChange}
              />
              <button onClick={handleSubmitEditValues}>submit</button>
              <button onClick={handleCancel}>close</button>
            </div>
          )}
        </div>

        {/* Ratings Section */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Ratings
        </h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          {Object.entries(ratings).map(([student, rating], index) => (
            <div
              key={index}
              className="flex justify-between p-3 bg-white rounded-lg shadow-md mb-2"
            >
              <span className="font-semibold text-blue-700">{student}</span>
              <span>Recording📹 {rating.recording}</span>
              <span>Explanation📖 {rating.explanation}</span>
              <span>Homework🏠 {rating.homework}</span>
              <span className="font-bold text-green-600">
                overall: {rating.overall}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Data */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Additional Data
        </h2>
        <span>{additionalText}</span>

        {/* Sessions Section */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Sessions
        </h2>
        {Object.keys(sessions).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(sessions).map(([day, sessionArray]) =>
              sessionArray.length > 0 ? (
                <div
                  key={day}
                  className="bg-gray-100 p-4 rounded-lg shadow-inner"
                >
                  <h3 className="text-xl font-bold text-purple-700 mb-2">
                    {day}
                  </h3>
                  <div className="space-y-2">
                    {sessionArray.map((session, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md"
                      >
                        <span className="text-gray-700 font-semibold">
                          {session.timeSpan}
                        </span>
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm">
                          {session.group}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">No sessions available.</p>
        )}
      </div>
    </div>
  );
}

export default ShowInstructorDetails;
