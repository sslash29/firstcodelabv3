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
function Instructor({ userData }) {
  const [sessions, setSessions] = useState(userData.sessions || {});
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [group, setGroup] = useState("");
  const { studentList } = useContext(UsersContext);

  const { filteredGroups, setFilteredGroups, setGroupList, groupList } =
    useContext(GroupContext);

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

      const groups = JSON.parse(data[0]["groups"].replace(/'/g, '"'));
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

  // Object { id: 1, created_at: "2025-03-02T19:18:04.210147+00:00", name: "mano", password: "mano29", type: "instructor", sessions: {…}, ratings: {…} }
  // const userDetails = userData ? Object.keys(userData) : [];
  // const user = [];
  // userDetails.forEach((user) => {
  //   const {created_at:_, password:_,}
  // });
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Instructor: {userData.name}</h2>

      {/* Session Form */}
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
      <DisplaySession daysOfWeek={daysOfWeek} sessions={sessions} />

      {/* add homework */}
      <AddHomework userData={userData} />
      <ShowRateUser users={studentList} userData={userData} />
    </div>
  );
}

export default Instructor;
