import { createContext, useEffect, useState } from "react";
import supabase from "../../supabase-client";

const GroupContext = createContext(null);

function GroupProvider({ children }) {
  const [filteredGroups, setFilteredGroups] = useState([]); // For autocomplete
  const [groupList, setGroupList] = useState([]); // Store fetched groups
  const [mounted, setMounted] = useState(false); // Add state to track mount status

  console.log("context is running");

  useEffect(() => {
    console.log("useEffect is running");

    setMounted(true); // Set mounted state to true when the effect runs

    async function fetchGroups() {
      console.log("function is running");

      const { data, error } = await supabase
        .from("Group_users")
        .select("*, Group(*),Users(*),Instructor(*)"); // Explicitly reference Group_1 for the name field

      if (error) {
        console.error("Error fetching groups:", error);
        return;
      }

      console.log("Fetched Data:", data); // Add this line to inspect the data directly
      // Map over the data to extract the group names
      const uniqueGroups = Array.from(
        new Map(data.map((group) => [group.group_id, group])).values()
      );
      setGroupList(uniqueGroups); // Set the group list without duplicates
      console.log(groupList);
    }

    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider
      value={{ setFilteredGroups, groupList, setGroupList, filteredGroups }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export { GroupContext, GroupProvider };
