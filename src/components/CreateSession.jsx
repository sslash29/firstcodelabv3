import ShowGroups from "./ShowGroups";

function CreateSession({
  day,
  setDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  group,
  handleGroupChange,
  addSession,
  daysOfWeek,
  selectGroup,
}) {
  return (
    <div>
      <div className="mb-4 p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Add Session</h3>
        <div className="flex gap-2 mb-2">
          <select
            className="border p-2 rounded"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="time"
            className="border p-2 rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          {/* Group Input with Autocomplete */}
          <div className="relative">
            <input
              type="text"
              className="border p-2 rounded w-48"
              placeholder="Group (e.g. Math Class)"
              value={group}
              onChange={(e) => handleGroupChange(e.target.value)}
            />

            <ShowGroups selectGroup={selectGroup} />
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={addSession}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
