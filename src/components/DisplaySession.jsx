function DisplaySession({ daysOfWeek, sessions }) {
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
                  {daySessions.map((session, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {session.timeSpan} - {session.group}
                    </li>
                  ))}
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
