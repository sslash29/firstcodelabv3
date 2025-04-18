import { useState } from "react";

function DisplaySession({ daysOfWeek, sessions, onUpdateSession }) {
  const [editing, setEditing] = useState(null); // { day, index }
  const [editValues, setEditValues] = useState({
    day: "",
    startTime: "",
    endTime: "",
    group: "",
  });

  const startEdit = (day, index, session) => {
    const [start, end] = session.timeSpan.split(" - ");
    setEditing({ day, index });
    setEditValues({
      day,
      startTime: start,
      endTime: end,
      group: session.group,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValues({ day: "", startTime: "", endTime: "", group: "" });
  };

  const handleSave = () => {
    onUpdateSession(editing.day, editing.index, editValues);
    cancelEdit();
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => {
          const daySessions = sessions[day] || [];
          const hasSessions =
            Array.isArray(daySessions) && daySessions.length > 0;

          return (
            <div key={day} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{day}</h3>
              {hasSessions ? (
                <ul className="mt-2">
                  {daySessions.map((session, index) => {
                    const isEditing =
                      editing?.day === day && editing?.index === index;
                    return (
                      <li
                        key={index}
                        className="text-sm text-gray-700 mb-2 flex items-center justify-between"
                      >
                        {isEditing ? (
                          <div className="flex flex-col gap-1 w-full">
                            <select
                              value={editValues.day}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  day: e.target.value,
                                })
                              }
                              className="border rounded p-1"
                            >
                              <option value="">Select Day</option>
                              {daysOfWeek.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <div className="flex gap-2">
                              <input
                                type="time"
                                value={editValues.startTime}
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    startTime: e.target.value,
                                  })
                                }
                                className="border rounded p-1"
                              />
                              <input
                                type="time"
                                value={editValues.endTime}
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    endTime: e.target.value,
                                  })
                                }
                                className="border rounded p-1"
                              />
                            </div>
                            <input
                              type="text"
                              value={editValues.group}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  group: e.target.value,
                                })
                              }
                              className="border rounded p-1"
                              placeholder="Group"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleSave}
                                className="text-sm px-2 py-1 bg-green-500 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-sm px-2 py-1 bg-gray-400 text-white rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span>
                              {session.timeSpan} - {session.group}
                            </span>
                            <button
                              className="text-blue-500 hover:underline ml-2 text-xs"
                              onClick={() => startEdit(day, index, session)}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">None</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DisplaySession;
