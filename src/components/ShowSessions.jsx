import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

function ShowSessions({ courses }) {
  const [instructorSessions, setInstructorSessions] = useState({});

  useEffect(() => {
    const fetchSessions = async () => {
      const ids = Object.values(courses).map((course) => course.instructor_id);

      const { data, error } = await supabase
        .from("instructors")
        .select("id, sessions")
        .in("id", ids);

      if (error) {
        console.error("Error fetching sessions:", error);
        return;
      }

      const sessionsMap = {};
      data.forEach((instructor) => {
        sessionsMap[instructor.id] = instructor.sessions;
      });

      setInstructorSessions(sessionsMap);
    };

    fetchSessions();
  }, [courses]);

  return (
    <div className="p-4 space-y-6">
      {Object.entries(courses).map(([courseName, courseInfo], index) => {
        const allSessions = instructorSessions[courseInfo.instructor_id];
        const group = courseInfo.group;

        // Filter sessions by group
        const filteredSessions = {};
        if (allSessions) {
          for (const [day, sessions] of Object.entries(allSessions)) {
            if (Array.isArray(sessions)) {
              const matchingSessions = sessions.filter(
                (s) => s.group === group
              );
              if (matchingSessions.length > 0) {
                filteredSessions[day] = matchingSessions;
              }
            }
          }
        }

        return (
          <div key={index} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{courseName}</h2>
            <p>
              <strong>Instructor:</strong> {courseInfo.instructor}
            </p>
            <p>
              <strong>Group:</strong> {courseInfo.group}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-1">Sessions:</h3>
              {Object.keys(filteredSessions).length === 0 ? (
                <p>No sessions found for this group.</p>
              ) : (
                <ul className="list-disc ml-5 space-y-1">
                  {Object.entries(filteredSessions).map(([day, sessions]) => (
                    <li key={day}>
                      <strong>{day}:</strong>
                      <ul className="ml-4 list-circle">
                        {sessions.map((s, i) => (
                          <li key={i}>{s.timeSpan}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ShowSessions;
