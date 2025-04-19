import { useState, useEffect, useContext } from "react";
import supabase from "../../supabase-client";
2;
import CreateSession from "../components/CreateSession";
import DisplaySession from "../components/DisplaySession";
import { GroupContext } from "../context/GroupContext";
import ShowRateUser from "../components/ShowRateUser";
import { UsersContext } from "../context/UsersContext";
import AddHomework from "../components/AddHomework";
import { logEvent } from "../utils/logEvent";
function Instructor() {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [group, setGroup] = useState("");
  const { studentList, userData } = useContext(UsersContext);

  const { filteredGroups, setFilteredGroups, setGroupList, groupList } =
    useContext(GroupContext);
  const [sessions, setSessions] = useState(userData.sessions || {});

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // 🔹 Fetch data on mount & listen for real-time updates
  useEffect(() => {
    // 🔹 Fetch all unique group names from Supabase
    async function fetchGroups() {
      const { data, error } = await supabase
        .from("Instructor")
        .select("groups")
        .eq("id", userData.id);

      if (error) {
        console.error("Error fetching groups:", error);
        return;
      }

      console.dir(data);

      const groups = data[0].groups;
      setGroupList(groups);
    }

    // 🔹 Fetch instructor sessions from Supabase
    async function fetchSessions() {
      if (!userData?.id) return;
      const { data, error } = await supabase
        .from("Instructor")
        .select("sessions")
        .eq("id", userData.id)
        .single();
      if (error) {
        console.error("Error fetching sessions:", error);
        return;
      }
      setSessions(data.sessions || {});
    }

    fetchGroups();
    fetchSessions();
    // 🔹 Subscribe to real-time updates for the Instructor's sessions
    const subscription = supabase
      .channel("sessions-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Instructor",
          filter: `id=eq.${userData.id}`,
        },
        (payload) => {
          console.log("Sessions updated:", payload);
          fetchSessions(); // Re-fetch sessions when an update occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Clean up subscription on unmount
    };
  }, [userData.id]);

  // 🔹 Filter group list for autocomplete
  const handleGroupChange = (value) => {
    setGroup(value);
    if (!value) {
      setFilteredGroups([]);
      return;
    }
    setFilteredGroups(
      groupList.filter((g) => g.toLowerCase().includes(value.toLowerCase()))
    );
  };

  // 🔹 Handle group selection from autocomplete
  const selectGroup = (selectedGroup) => {
    setGroup(selectedGroup);
    setFilteredGroups([]); // Hide suggestions
  };

  // 🔹 Add a session
  const addSession = async () => {
    if (!day || !startTime || !endTime || !group) {
      alert("Please enter all fields!");
      return;
    }

    // Create a new sessions object
    const updatedSessions = { ...sessions };
    if (!Array.isArray(updatedSessions[day])) {
      updatedSessions[day] = [];
    }

    // Add the new session
    updatedSessions[day].push({
      timeSpan: `${startTime} - ${endTime}`,
      group: group,
    });

    // Update Supabase database
    if (!userData?.id) {
      console.error("Error: userData.id is undefined");
      return;
    }

    const { error } = await supabase
      .from("Instructor")
      .update({ sessions: updatedSessions })
      .eq("id", userData.id);

    if (error) {
      console.error("Error updating session:", error);
      alert("Failed to add session!");
      return;
    }

    await logEvent(
      `Instructor ${userData.name} added session for ${group} on ${day} from ${startTime} to ${endTime}`,
      userData.id
    );

    // Clear input fields after adding a session
    setDay("");
    setStartTime("");
    setEndTime("");
    setGroup("");
  };

  const onUpdateSession = async (prevDay, sessionIndex, updated) => {
    const updatedSessions = { ...sessions };

    // Remove the session from the old day
    const sessionToUpdate = updatedSessions[prevDay][sessionIndex];
    updatedSessions[prevDay].splice(sessionIndex, 1);

    // Add it to the new day
    const newSession = {
      timeSpan: `${updated.startTime} - ${updated.endTime}`,
      group: updated.group,
    };

    if (!Array.isArray(updatedSessions[updated.day])) {
      updatedSessions[updated.day] = [];
    }
    updatedSessions[updated.day].push(newSession);

    // Save to DB
    const { error } = await supabase
      .from("Instructor")
      .update({ sessions: updatedSessions })
      .eq("id", userData.id);

    if (error) {
      console.error("Failed to update session:", error);
      alert("Could not update session!");
      return;
    }

    setSessions(updatedSessions);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Instructor: {userData.name}</h2>
      <CreateSession
        filteredGroups={filteredGroups}
        day={day}
        setDay={setDay}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        group={group}
        handleGroupChange={handleGroupChange}
        selectGroup={selectGroup}
        addSession={addSession}
        daysOfWeek={daysOfWeek}
      />
      {/* Display Sessions */}
      <DisplaySession
        daysOfWeek={daysOfWeek}
        sessions={sessions}
        onUpdateSession={onUpdateSession}
      />
      <AddHomework userData={userData} />
      <ShowRateUser users={studentList} userData={userData} />
    </div>
    // <p>hello</p>
  );
}

export default Instructor;
